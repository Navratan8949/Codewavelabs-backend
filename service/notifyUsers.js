const cron = require("node-cron");
const { SendVerificationCode } = require("../src/utils/nodemailer.js");
const User = require("../src/model/user.model.js");
const Reminder = require("../src/model/reminder.model.js");

const notifyUsers = () => {
  cron.schedule("0 3 * * *", async () => {
    // Runs daily at 9:00 AM IST
    try {
      const currentDate = new Date(); // 12:46 PM IST, August 25, 2025
      console.log("Running notification check at:", currentDate);

      const reminders = await Reminder.find({
        isActive: true,
        isNotified: false,
      })
        .populate("userId", "username email")
        .populate("dependentId", "name")
        .populate("serviceType", "name fields");

      for (const reminder of reminders) {
        const {
          userId,
          dependentId,
          categoryType,
          reminderDays,
          data,
          serviceType,
        } = reminder;
        let email, username;

        // Determine the email and username based on category
        if (categoryType === "Dependent" && dependentId) {
          const user = await User.findById(userId);
          email = user.email;
          username = user.username;
        } else {
          email = userId.email;
          username = userId.username;
        }

        if (!email) {
          console.log(`No email found for reminder ${reminder._id}`);
          continue;
        }

        // Determine the key date from serviceType fields
        let keyDateField = serviceType.fields.find(
          (field) => field.type === "Date" && data[field.name]
        )?.name;
        if (!keyDateField) {
          console.log(`No valid date field found for reminder ${reminder._id}`);
          continue;
        }

        const keyDate = new Date(data[keyDateField]);
        if (isNaN(keyDate)) {
          console.log(
            `Invalid date for reminder ${reminder._id}: ${data[keyDateField]}`
          );
          continue;
        }

        // Calculate notification dates based on reminderDays
        const notificationDates = reminderDays
          .map((day) => {
            const daysToSubtract = {
              sameDay: 0,
              oneDayBefore: 1,
              "5days": 5,
              "15days": 15,
              "1month": 30,
            }[day];
            if (daysToSubtract === undefined) {
              console.log(
                `Invalid reminderDay: ${day} for reminder ${reminder._id}`
              );
              return null;
            }
            return new Date(keyDate - daysToSubtract * 24 * 60 * 60 * 1000);
          })
          .filter((date) => date !== null);

        // Check if current date matches any notification date
        if (notificationDates.some((date) => isSameDay(date, currentDate))) {
          const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6;">
              <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Reminder Notification</h2>
                <p>Hi <strong>${username}</strong>,</p>
                <p>This is a reminder that your <strong>${
                  serviceType.name
                }</strong> (${
            categoryType === "Dependent" ? `for ${dependentId.name}` : ""
          }) is due on <strong>${keyDate.toDateString()}</strong>.</p>
                <p>Please complete the action by the specified date to avoid any issues.</p>
                <p style="margin-top: 30px;">Thanks,<br/>Reminder System</p>
              </div>
            </div>
          `;

          await SendVerificationCode(
            email,
            html,
            "Reminder Notification",
            `Hi ${username}, your ${serviceType.name} (${
              categoryType === "Dependent" ? `for ${dependentId.name}` : ""
            }) is due on ${keyDate.toDateString()}. Please complete it.`
          );
          reminder.isNotified = true;
          await reminder.save();
          console.log(
            `Notification sent to ${email} for reminder ${reminder._id}`
          );
        }
      }
    } catch (error) {
      console.error("Error in notifyUsers:", error);
    }
  });
};

// Helper function to compare dates ignoring time
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

module.exports = { notifyUsers };
