function getDayOfWeek(date, short) {
  if (date && date != "Invalid Date") {
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";

    if (short) {
      return weekdays[date.getDay()].substring(0, 3);
    } else {
      return weekdays[date.getDay()];
    }
  } else {
    return false;
  }
}

function getMonth(date, short) {
  if (date && date != "Invalid Date") {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    if (short) {
      return months[date.getMonth()].substring(0, 3);
    } else {
      return months[date.getMonth()];
    }
  } else {
    return false;
  }
}

function applyFormatDate(date, options) {
  function format_date_ie(input_string) {
    if (input_string != null) {
      var time = null;

      try {
        time = input_string.split(" ")[1].split(":");
      } catch (error) {
        time = ["00", "00", "00"];
      }

      var date = input_string.split(" ")[0].split("-");

      if (date[0].length === 2) {
        date = [date[2], date[1], date[0]];
      }

      if (date.length === 1) {
        return new Date(input_string);
      } else {
        return new Date(
          date[0],
          date[1] - 1,
          date[2],
          time[0],
          time[1],
          time[2]
        );
      }
    } else {
      return input_string;
    }
  }

  if (date != undefined) {
    var formatted_date = "";

    if (options == undefined) {
      options = {};
    }

    if (options["format"] == undefined) {
      options["format"] = "yyyy-MM-dd HH:mm:ss";
    }

    if (typeof date != "object") {
      if (typeof date != "number" && parseInt(date, 10) != date) {
        // Format date string into correct format if '/' is used or the year is backwards

        formatted_date = String(date)
          .split("/")
          .join("-");

        var exploded_string = formatted_date.split(" ");
        var exploded_string_two = exploded_string[0].split("-");

        // If the date given is only 1 digit per group, e.g 1/5/2018

        for (var i = 0, len = exploded_string_two.length; i < len; i++) {
          if (String(exploded_string_two[i]).length === 1) {
            exploded_string_two[i] = parseInt(exploded_string_two[i]).padLeft();
          }
        }

        if (exploded_string_two[0].length === 2) {
          var year = exploded_string_two[2];
          var day = exploded_string_two[0];

          exploded_string_two[0] = year;
          exploded_string_two[2] = day;
          exploded_string[0] = exploded_string_two.join("-");

          formatted_date = exploded_string.join(" ");
        }
      } else {
        formatted_date =
          String(date).length < 13 ? parseInt(date, 10) * 1000 : parseInt(date);
      }

      try {
        date = format_date_ie(formatted_date);
      } catch (error) {
        date = new Date(formatted_date);
      }
    }

    var returned_date = options["format"];
    var hours = date.getHours();

    let _day = date.getDate().padLeft();
    let displayDay = options["text"]
      ? `${getDayOfWeek(date, true)} ${_day}`
      : _day;
    let displayMonth = options["text"]
      ? getMonth(date, true)
      : (date.getMonth() + 1).padLeft();

    returned_date = returned_date
      .replace("ss", date.getSeconds().padLeft())
      .replace("mm", date.getMinutes().padLeft())
      .replace("HH", hours.padLeft())
      .replace("dd", displayDay)
      .replace("MM", displayMonth)
      .replace("yyyy", date.getFullYear())
      .replace("yy", String(date.getFullYear()).substr(2, 2));

    if (options["format"].includes("hh")) {
      if (hours >= 12) {
        returned_date += " PM";

        if (hours > 12) {
          hours -= 12;
        }
      } else {
        returned_date += " AM";
      }

      returned_date = returned_date.replace(
        "hh",
        options["pad"] === true ? hours.padLeft() : hours
      );
    }

    return returned_date;
  }
}

// Enter date or date object. e.g 2018-08-12 12:08:54
// Return 2018-08-12 12:08:54 for default
// Enter format to return date in desired format
// hh = AM/PM, HH = 24 hour clock
// Example date_utility_svc.format_date(new Date(), {'format' : 'yyyy-mm-ss HH:mm'}). A string date may also be inputted.
// Options:
//      format      :   {yyyy-MM-dd HH:mm:ss}   =   Define output arrangement
//      pad         :   true                    =   Returns hours with a leading 0 if under 10

export default {
  methods: {
    formatDate: (date, options) => {
      return applyFormatDate(date, options);
    },
    getMonth: (date, short) => {
      return getMonth(date, short);
    },
    getDayOfWeek: (date, short) => {
      return getDayOfWeek(date, short);
    }
  }
};
