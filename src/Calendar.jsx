import React, { useState, useEffect } from "react";
import globalize from "globalize";
import PropTypes from "prop-types";
import localizer from "react-big-calendar/lib/localizers/globalize";
import { Calendar } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import clsx from "clsx";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./Calendar.css";
import OutlinedIcon from "./OutlinedIcon.jsx";
import {
  IconButton,
  Select,
  MenuItem,
  InputBase,
  withStyles,
  Button,
} from "@material-ui/core";
import { Calendar as SmallCalendar } from "@material-ui/pickers";
require("globalize/lib/cultures/globalize.culture.fr");
/**
 * This function returns a Calendar that either offers drag and drop functionality or not.
 */
export const CalendarGen = (isDraggable) =>
  isDraggable ? withDragAndDrop(Calendar) : Calendar;

const globalizeLocalizer = localizer(globalize);

/**
 * Basic calendar component that will simply display the events it is given as they are in the
 * object, coloring each event with the color specified in its "color" attribute.
 */

const Toolbar = ({
  localizer: { messages },
  label,
  onView,
  views,
  view: defaultView,
  onNavigate,
}) => {
  const [view, setView] = useState(defaultView);
  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);
  const NewButton = withStyles((theme) => ({
    root: {
      backgroundColor: "transparent",
      border: "1px solid #dadce0",
      WebkitBorderRadius: "4px",
      borderRadius: "4px",
      WebkitBoxSizing: "border-box",
      boxSizing: "border-box",
      height: "36px",
      margin: "7px 12px 5px 12px",
      display: "flex",
      alignContent: "center",
      opacity: "1",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.04)",
      cursor: "pointer",
    },
    label: {
      fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
      fontSize: "14px",
      color: "#3c4043",
      fontWeight: "500",
      letterSpacing: "0.25px",
      textTransform: "none",
    },
  }))(Button);
  const BootstrapInput = withStyles((theme) => ({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: "transparent",
      border: "1px solid #ced4da",
      fontSize: 14,
      padding: "10px 28px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  }))(InputBase);

  const navigate = (action) => {
    onNavigate(action);
  };

  return (
    <div className="rbc-toolbar">
      <span style={{ display: "flex", alignItems: "center" }}>
        <NewButton
          variant="outlined"
          onClick={() => {
            navigate("TODAY");
          }}
          className="rbc-button ripple"
        >
          Aujourd'hui
        </NewButton>
        <IconButton
          size="small"
          style={{ margin: 10 }}
          onClick={() => navigate("PREV")}
        >
          <OutlinedIcon style={{ margin: 0 }}>navigate_before</OutlinedIcon>
        </IconButton>
        <IconButton size="small" onClick={() => navigate("NEXT")}>
          <OutlinedIcon style={{ margin: 0 }}>navigate_next</OutlinedIcon>
        </IconButton>
        <span className="rbc-toolbar-label">{label}</span>
      </span>

      <Select
        labelId="demo-customized-select-label"
        id="demo-customized-select"
        value={view}
        onChange={(view) => {
          setView(view.target.value);
          onView(view.target.value);
        }}
        style={{ backgroundColor: "#00000000" }}
        input={<BootstrapInput />}
      >
        {views.map((view) => (
          <MenuItem value={view}>
            {view[0].toUpperCase() + view.slice(1)}
          </MenuItem>
        ))}
      </Select>
      {/* <span className="rbc-btn-group">{viewNamesGroup(messages)}</span> */}
    </div>
  );
};

function CalendarUnit({
  startKey,
  endKey,
  titleKey,
  colorKey,
  eventStyle,
  isDraggable,
  messages,
  onSelectSlot,
  data,
  onEventClick,
  defaultDate,
  drilldownView,
  culture,
  defaultView,
  calendarStyle,
  height,
  length,
  onRangeChange,
  isResizable,
  onChangeEvent,
  FilterComp,
}) {
  const StaticCalendar = CalendarGen(isResizable || isDraggable);
  const [date, setDate] = useState(new Date());
  const [dv, setDv] = React.useState(data);
  React.useEffect(() => {
    const element = document.createElement("span");
    element.id = "month";
    element.appendChild(
      document.createTextNode(new Date().toUTCString().slice(8, 16))
    );
    const parent = document.querySelector(
      ".MuiPickersCalendarHeader-switchHeader"
    );
    parent.insertBefore(element, parent.firstChild);
    const arrowContainer = document.createElement("div");
    Array.prototype.slice
      .call(parent.children, 1)
      .forEach((child) => arrowContainer.appendChild(child));
    parent.appendChild(arrowContainer);
  }, []);
  useEffect(() => {
    document.querySelector("#month").innerText = new Date(date)
      .toUTCString()
      .slice(8, 16);
  }, [date]);
  React.useEffect(() => {
    setDv(data);
  }, [JSON.stringify(data)]);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      <StaticCalendar
        messages={messages}
        culture={culture}
        localizer={globalizeLocalizer}
        eventPropGetter={({ style }) => ({ style })}
        onSelectSlot={onSelectSlot}
        onSelectEvent={(e) => {
          /*let dt = dv.filter(d=>d[titleKey] === e.title)[0];*/ console.log(e);
          onEventClick(e.resources, e);
        }}
        date={date}
        defaultView={defaultView}
        onNavigate={(date) => setDate(new Date(date))}
        events={dv.map((dt) => {
          const d = {
            ...dt,
            start: dt[startKey],
            end: dt[endKey],
            title: dt[titleKey],
            color: dt[colorKey],
            style: {
              ...eventStyle,
              backgroundColor:
                new Date(dt[startKey]).toDateString() ===
                new Date(dt[endKey]).toDateString()
                  ? "#fff"
                  : dt[colorKey],
            },
          };
          const { start, end, title, style, ...resources } = d;
          delete resources[startKey];
          delete resources[endKey];
          delete resources[titleKey];
          return {
            start: new Date(start),
            end: new Date(end),
            title,
            style,
            resources,
          };
        })}
        onEventDrop={onChangeEvent}
        onEventResize={onChangeEvent}
        onRangeChange={onRangeChange}
        drilldownView={drilldownView}
        showMultiDayTimes
        selectable
        resizable={isResizable}
        style={{
          ...calendarStyle,
          height,
          width: "76%",
          flexGrow: 10,
          marginRight: 5,
        }}
        length={length}
        components={{
          agenda: {
            event: ({ event, title }) => (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onEventClick(event)}
              >
                {title}
              </div>
            ),
          },
          toolbar: Toolbar,
          month: {
            event: ({ event: { start, end, color }, title }) =>
              new Date(start).toDateString() ===
              new Date(end).toDateString() ? (
                <div className="round-container">
                  <div
                    className="round"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div>
                    {String(new Date(start).toISOString().slice(11, 16)) +
                      " " +
                      title}
                  </div>
                </div>
              ) : (
                title
              ),
          },
          event_cell: () => <div></div>,
        }}
        isDraggable={isDraggable}
      />
      <div id="calendar-sidebar">
        <SmallCalendar
          date={date}
          ToolbarComponent={() => null}
          autoOk
          orientation="landscape"
          variant="static"
          openTo="date"
          onChange={setDate}
          value={date}
        />
        {FilterComp && FilterComp}
      </div>
    </div>
  );
}

CalendarUnit.propTypes = {
  /**
   * String defining the event's start attribute
   */
  startKey: PropTypes.string.isRequired,
  /**
   * String defining the event's end attribute
   */
  endKey: PropTypes.string.isRequired,
  /**
   * String defining the event's title attribute
   */
  titleKey: PropTypes.string.isRequired,
  /**
   * String defining the event's color attribute
   */
  colorKey: PropTypes.string,
  /**
   * String defining the event's style attribute
   */
  eventStyle: PropTypes.shape({}),
  /**
   * 'Drag and drop' functionality
   */
  isDraggable: PropTypes.bool,
  /**
   * Text to display in the Calendar, it will replace the multiple fields whose name
   * is the key of each item in the object
   */
  messages: PropTypes.shape({
    more: PropTypes.string,
    previous: PropTypes.string,
    agenda: PropTypes.string,
    allDay: PropTypes.string,
    date: PropTypes.string,
    today: PropTypes.string,
    day: PropTypes.string,
    event: PropTypes.string,
    month: PropTypes.string,
    next: PropTypes.string,
    week: PropTypes.string,
  }),
  /**
   * Callback fired when an event is selected (clicked)
   */
  onEventClick: PropTypes.func,
  /**
   * Callback fired when a slot is selected (click, multiple selection)
   */
  onSelectSlot: PropTypes.func,
  /**
   * Callback fired when an event is edited (Resized, moved) - _Drag and drop functionality_
   */
  onChangeEvent: PropTypes.func,
  /**
   * The list of events to display
   */
  data: PropTypes.arrayOf(
    /**
     * Array of objects
     */
    PropTypes.shape({})
  ).isRequired,
  /**
   * Date to display by default on the calendar
   */
  defaultDate: PropTypes.instanceOf(Date),
  /**
   * View to display after a drilldown event (clicking on a date)
   */
  drilldownView: PropTypes.string,
  /**
   * Calendar's culture type - "fr" for French
   */
  culture: PropTypes.string,
  /**
   * Default view to display upon loading the calendar
   */
  defaultView: PropTypes.oneOf("month", "week", "day"),
  /**
   * Calendar's height
   */
  height: PropTypes.node,
  /**
   * Calendar's style object
   */
  // eslint-disable-next-line react/forbid-prop-types
  calendarStyle: PropTypes.object,
  /**
   * Determines the end date from date prop in the agenda view date prop + length
   * (in number of days) = end date
   */
  length: PropTypes.number,
  onRangeChange: PropTypes.func,
  isResizable: PropTypes.bool,
};

CalendarUnit.defaultProps = {
  isDraggable: false,
  messages: {
    more: "Plus",
    previous: "Précédent",
    agenda: "Agenda",
    allDay: "Journée",
    date: "Date",
    today: "Aujourd'hui",
    day: "Jour",
    event: "Evenement",
    month: "Mois",
    next: "Suivant",
    week: "Semaine",
  },
  onChangeEvent: () => {},
  onSelectSlot: () => {},
  onEventClick: () => {},
  onRangeChange: () => {},
  defaultDate: new Date(),
  drilldownView: "week",
  culture: undefined,
  defaultView: "month",
  height: "100vh",
  calendarStyle: {},
  length: 365,
  colorKey: undefined,
  eventStyle: {},
  isResizable: false,
};

export default CalendarUnit;
