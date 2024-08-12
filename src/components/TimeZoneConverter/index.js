import React, { Component } from 'react';
import moment from 'moment-timezone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TimeZoneDisplay from '../TimeZoneDisplay';
import AddTimeZone from '../AddTimeZone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

class TimeZoneConverter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeZones: [
                { id: '1', zone: 'UTC', time: moment(), date: moment(), min: 0 },
                { id: '2', zone: 'Asia/Kolkata', time: moment(), date: moment(), min: 0 }
            ],
            selectedDate: moment(),
            darkMode: false,
            minMinutes: 0,
            maxMinutes: 1439,
            timeFormat: '24',
            selectedZoneId: null
        };
    }

    handleTimeZoneAddition = (timeZone) => {
        const newId = (this.state.timeZones.length + 1).toString();
        const defaultTime = moment().startOf('day');

        this.setState(prevState => ({
            timeZones: [
                ...prevState.timeZones,
                {
                    id: newId,
                    zone: timeZone,
                    time: defaultTime,
                    date: moment(),
                    min: 0
                }
            ]
        }));
    };

    handleTimeZoneDeletion = (id) => {
        this.setState(prevState => ({
            timeZones: prevState.timeZones.filter(timeZone => timeZone.id !== id)
        }));
    };

    onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(this.state.timeZones);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        this.setState({ timeZones: items });
    };

    handleTimeChange = (e) => {
        const minutes = e.target.value;
        this.setState(prevState => ({
            timeZones: prevState.timeZones.map(tz =>
                tz.id === this.state.selectedZoneId
                    ? { ...tz, min: Number(minutes) }
                    : tz
            )
        }));
    };

    handleDateChange = (date) => {
        this.setState({
            selectedDate: moment(date),
            timeZones: this.state.timeZones.map(tz => ({
                ...tz,
                date: moment(date)
            }))
        });
    };

    toggleDarkMode = () => {
        this.setState(prevState => ({
            darkMode: !prevState.darkMode
        }));
    };

    handleMinMaxChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: Number(value) });
    };

    toggleTimeFormat = () => {
        this.setState(prevState => ({
            timeFormat: prevState.timeFormat === '24' ? '12' : '24'
        }));
    };

    handleZoneSelect = (id) => {
        this.setState({ selectedZoneId: id });
    };

    render() {
        const { timeZones, selectedDate, darkMode, minMinutes, maxMinutes, timeFormat, selectedZoneId } = this.state;
        const themeClass = darkMode ? 'dark-mode' : 'light-mode';

        return (
            <div className={`bg-container ${themeClass}`}>
                <div className="container">
                    <h1 className='heading-time-zone'>Time Zone Converter</h1>
                    <button onClick={this.toggleDarkMode} className="dark-mode-toggle">
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={this.toggleTimeFormat} className="time-format-toggle">
                        {timeFormat === '24' ? 'Switch to 12-Hour Format' : 'Switch to 24-Hour Format'}
                    </button>
                    <DatePicker
                        selected={selectedDate.toDate()}
                        onChange={this.handleDateChange}
                        className="date-picker"
                    />
                    <div className="slider-controls">
                        <label>Min Minutes:</label>
                        <input
                            type="number"
                            name="minMinutes"
                            value={minMinutes}
                            onChange={this.handleMinMaxChange}
                            className="min-max-input"
                        />
                        <label>Max Minutes:</label>
                        <input
                            type="number"
                            name="maxMinutes"
                            value={maxMinutes}
                            onChange={this.handleMinMaxChange}
                            className="min-max-input"
                        />
                    </div>
                    {selectedZoneId && (
                        <input
                            type="range"
                            min={minMinutes}
                            max={maxMinutes}
                            value={timeZones.find(tz => tz.id === selectedZoneId)?.min || 0}
                            onChange={this.handleTimeChange}
                            className="time-slider"
                        />
                    )}
                    <AddTimeZone onAdd={this.handleTimeZoneAddition} />
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <div
                                    className="droppable"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {timeZones.map((tz, index) => (
                                        <Draggable key={tz.id} draggableId={tz.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="draggable"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => this.handleZoneSelect(tz.id)}
                                                >
                                                    <TimeZoneDisplay
                                                        timeZone={tz.zone}
                                                        referenceTime={moment(tz.date).startOf('day').add(tz.min, 'minutes')}
                                                        timeFormat={timeFormat}
                                                        onDelete={() => this.handleTimeZoneDeletion(tz.id)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        );
    }
}

export default TimeZoneConverter;
