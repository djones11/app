// Converts seconds to desired format
// Return 06:14:53 by default
// Enter 'text' = true option to return words. i.e. 3 hours 2 minutes 56 seconds
// Example date_utility_svc.seconds_to_time(185, {'format' : 'mm:ss'}) would return 03:05
// Options:
//      format      :   {hh:mm:ss}  =   Define output arrangement
//      text        :   true        =   Returns format in words, i.e 5 hours 3 minutes 23 seconds
//      truncate    :   2           =   Returns truncate number of elements, i.e truncate 2 of 3 hours 43 minutes 34 seconds returns 3 hours 43 minutes

export default {
  methods: {
    secondsToTime: function(seconds, options) {
      if (seconds < 0) {
        seconds = 0;
      }

      if (seconds != undefined) {
        if (options == undefined) {
          options = {};
        }

        if (options["format"] == undefined) {
          if (options["text"] == true) {
            options["format"] = "dd hh mm ss";
          } else {
            options["format"] = "dd:hh:mm:ss";
          }
        }

        if (typeof seconds == "string" && seconds.includes(":")) {
          let formatted_seconds = 0;
          let _seconds = seconds.split(":");

          formatted_seconds += parseInt(_seconds[0]) * 3600;
          formatted_seconds += parseInt(_seconds[1]) * 60;
          formatted_seconds += parseInt(_seconds[2]);

          seconds = formatted_seconds;
        }

        var days = 0;
        var hours = 0;
        var minutes = 0;
        var formatSeconds = 0;
        var formatMinutes = 0;
        var formatHours = 0;
        var formatDays = 0;
        var returnedTime = 0;

        seconds = Number(seconds);

        if (options["text"] === true) {
          days = Math.abs(Math.floor(seconds / 86400));
          hours = Math.abs(Math.floor((seconds % 86400) / 3600));
          minutes = Math.abs(Math.floor((seconds % 3600) / 60));
          seconds = Math.floor((seconds % 3600) % 60);

          formatSeconds =
            seconds == 0
              ? ""
              : seconds == 1
              ? (seconds += " sec")
              : (seconds += " secs");
          formatMinutes =
            minutes == 0
              ? ""
              : minutes == 1
              ? (minutes += " min")
              : (minutes += " mins");
          formatHours =
            hours == 0
              ? ""
              : hours == 1
              ? (hours += " sec")
              : (hours += " sec");
          formatDays =
            days == 0 ? "" : days == 1 ? (days += " day") : (days += " days");
        } else {
          formatSeconds = Math.floor((seconds % 3600) % 60).padLeft();
          formatMinutes = Math.abs(Math.floor((seconds % 3600) / 60)).padLeft();
          formatHours = Math.abs(Math.floor(seconds / 3600)).padLeft();
          formatDays = Math.abs(Math.floor(seconds / 86400)).padLeft();
        }

        returnedTime = options["format"]
          .replace("ss", formatSeconds)
          .replace("mm", formatMinutes)
          .replace("hh", formatHours)
          .replace("dd", formatDays)
          .trim();

        if (options["truncate"]) {
          let delimiter = options["text"] ? " " : ":";
          let slice = options["truncate"] * (options["text"] ? 2 : 1);

          returnedTime = returnedTime.split(delimiter).join(delimiter);

          let explodedString = returnedTime.split(delimiter);
          explodedString = explodedString.filter(x => x != "");

          returnedTime = explodedString.splice(0, slice).join(delimiter);
        }

        if (!returnedTime) {
          returnedTime = `0 ${options["text"] ? " secs" : ""}`;
        }
      } else {
        returnedTime = options["format"]
          .replace("ss", "00")
          .replace("mm", "00")
          .replace("hh", "00")
          .replace("dd", "00");
      }

      return returnedTime;
    }
  }
};
