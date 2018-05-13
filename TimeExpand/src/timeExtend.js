$.extend(String.prototype, {
    toDate: function () {
        if (this) {
            return citms.parseDate(this.toString());
        }
        return null;
    },
    formatDateString: function (format) {
        format = format || "yyyy-MM-dd";
        if (this) {
            return formatDate(parseDate(this.toString()), format);
        }
        return null;
    },
    parseDate: function (s, ignoreTimezone) {
        try {
            var d = eval(s);
            if (d && d.getFullYear) return d;
        } catch (ex) {
        }

        if (typeof s == 'object') {
            return isNaN(s) ? null : s;
        }
        if (typeof s == 'number') {

            var d = new Date(s * 1000);
            if (d.getTime() != s) return null;
            return isNaN(d) ? null : d;
        }
        if (typeof s == 'string') {

            m = s.match(/^([0-9]{4})([0-9]{2})([0-9]{2})$/);
            if (m) {
                var date = new Date(m[1], m[2] - 1, m[3]);
                return date;
            }


            m = s.match(/^([0-9]{4}).([0-9]*)$/);
            if (m) {
                var date = new Date(m[1], m[2] - 1);
                return date;
            }

            if (s.match(/^\d+(\.\d+)?$/)) {
                var d = new Date(parseFloat(s) * 1000);
                if (d.getTime() != s) return null;
                else return d;
            }
            if (ignoreTimezone === undefined) {
                ignoreTimezone = true;
            }
            var d = parseISO8601(s, ignoreTimezone) || (s ? new Date(s) : null);
            return isNaN(d) ? null : d;
        }

        return null;
    },
    parseISO8601: function (s, ignoreTimezone) {
        var m = s.match(/^([0-9]{4})([-\/]([0-9]{1,2})([-\/]([0-9]{1,2})([T ]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
        if (!m) {

            m = s.match(/^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2})[T ]([0-9]{1,2})/);
            if (m) {
                var date = new Date(m[1], m[2] - 1, m[3], m[4]);
                return date;
            }


            m = s.match(/^([0-9]{4}).([0-9]*)/);
            if (m) {
                var date = new Date(m[1], m[2] - 1);
                return date;
            }


            m = s.match(/^([0-9]{4}).([0-9]*).([0-9]*)/);
            if (m) {
                var date = new Date(m[1], m[2] - 1, m[3]);
                return date;
            }


            m = s.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
            if (!m) return null;
            else {
                var date = new Date(m[3], m[1] - 1, m[2]);
                return date;
            }
        }
        var date = new Date(m[1], 0, 1);
        if (ignoreTimezone || !m[14]) {
            var check = new Date(m[1], 0, 1, 9, 0);
            if (m[3]) {
                date.setMonth(m[3] - 1);
                check.setMonth(m[3] - 1);
            }
            if (m[5]) {
                date.setDate(m[5]);
                check.setDate(m[5]);
            }
            citms.fixDate(date, check);
            if (m[7]) {
                date.setHours(m[7]);
            }
            if (m[8]) {
                date.setMinutes(m[8]);
            }
            if (m[10]) {
                date.setSeconds(m[10]);
            }
            if (m[12]) {
                date.setMilliseconds(Number("0." + m[12]) * 1000);
            }
            citms.fixDate(date, check);
        } else {
            date.setUTCFullYear(
                m[1],
                m[3] ? m[3] - 1 : 0,
                m[5] || 1
            );
            date.setUTCHours(
                m[7] || 0,
                m[8] || 0,
                m[10] || 0,
                m[12] ? Number("0." + m[12]) * 1000 : 0
            );
            var offset = Number(m[16]) * 60 + (m[18] ? Number(m[18]) : 0);
            offset *= m[15] == '-' ? 1 : -1;
            date = new Date(+date + (offset * 60 * 1000));
        }
        return date;
    },
});