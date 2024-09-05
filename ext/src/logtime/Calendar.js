import { Button, Col, Flex, Row, Select, Spin } from 'antd';
import React from 'react';
import moment, { max } from 'moment';
import { Calendar as AntCalendar } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useUser } from '../context/useUser';
import useLogtime from '../hooks/useLogtime';
import dayjs from 'dayjs';

function convertDurationToHoursMinutes(duration) {
	if (!duration)
		return '0h';
    const [heures, minutes] = duration.split(':');
    return `${heures}h${minutes.padStart(2, '0')}`;
}

function convertDurationToColor(duration) {
	if (!duration)
		return 'transparent';
	const [hours, minutes] = duration.split(':');
	const intensity = (parseInt(minutes) + parseInt(hours) * 60) / (24 * 60);
	return `rgba(0, 186, 188, ${intensity})`;
}

const Calendar = () => {

	const { user } = useUser();

	if (!user){
		return null;
	}

	const currentUrl = window.location.href;
	const parts = currentUrl.split('/');
	const login = currentUrl.split('/')[parts.length - 1];

	const {durations, loading, from} = useLogtime(login);
	const validRange = [dayjs(from), dayjs().add(1, 'day')];

	const disabledDate = (date) => {
		return date && date > moment().endOf('day') || date < moment(from);
	};

	const cellRender = (date) => {

		const dateKey = date.format('YYYY-MM-DD');
		const duration = durations[dateKey];

		return (
			<Flex
			key={date.date()}
			style={{
				aspectRatio: '1/1',
				background: convertDurationToColor(duration),
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
			>
				<p
					style={{
						margin: 0,
					}}
				>
					{date.date()}
				</p>
				{
					!disabledDate(date) && 
					<p
						style={{
							margin: 0,
							color: duration ? 'darkgray' : 'lightgray',
						}}
					>
						{convertDurationToHoursMinutes(duration)}
					</p>
				}
			</Flex>
		);
	};

	const headerRender = ({ value, onChange }) => {
		const current = value.clone();

		const isPrevMonthDisabled = current.month() <= validRange[0].month() && current.year() <= validRange[0].year();
		const isNextMonthDisabled = current.month() >= validRange[1].month() && current.year() >= validRange[1].year();

		const monthOptions = moment.months().map((month, index) => {
			const optionDisabled = current.year() === validRange[0].year() && index < validRange[0].month() ||
									current.year() === validRange[1].year() && index > validRange[1].month();
			return (
				<Select.Option key={month} value={index} disabled={optionDisabled}>
					{month} ({convertDurationToHoursMinutes(durations[current.month(index).format('YYYY-MM')])})
				</Select.Option>
			);
		});

		const yearOptions = Array.from({ length: validRange[1].year() - validRange[0].year() + 1 }, (_, i) => {
			return validRange[0].year() + i;
		}).map((year) => {
			return (
				<Select.Option key={year} value={year}>
					{year} ({convertDurationToHoursMinutes(durations[current.year(year).format('YYYY')])})
				</Select.Option>
			)
		});

		const selectMonth = (
		<Select
			style={{
				Flex: 1,
			}}
			value={current.month()}
			onChange={(newMonth) => {
			const newValue = value.clone().month(newMonth);
			onChange(newValue);
			}}
			dropdownMatchSelectWidth={false}
		>
			{monthOptions}
		</Select>
		);

		const selectYear = (
		<Select
			style={{
				Flex: 1,
			}}
			value={current.year()}
			onChange={(newYear) => {
			var newValue = value.clone().year(newYear);
			newValue = newValue < validRange[0] ? validRange[0] : newValue;
			newValue = newValue > validRange[1] ? validRange[1] : newValue;
			onChange(newValue);
			}}
			dropdownMatchSelectWidth={false}
		>
			{yearOptions}
		</Select>
		);

		return (
			<Row justify="space-between" align="middle" style={{ padding: 8 }}>
				<Col>
				<Button
					icon={<LeftOutlined />}
					onClick={() => onChange(current.subtract(1, 'month'))}
					disabled={isPrevMonthDisabled}
				/>
				</Col>
				<Col>
					{selectMonth} {selectYear}
				</Col>
				<Col>
				<Button
					icon={<RightOutlined />}
					onClick={() => onChange(current.add(1, 'month'))}
					disabled={isNextMonthDisabled}
				/>
				</Col>
			</Row>
		);
  };

  React.useEffect(() => {
	const body = document.querySelectorAll('.ant-picker-body')[0]
	if (body)
		body.style.padding = '8px 18px';

	const cell = document.querySelectorAll('.ant-picker-cell');
	cell.forEach((element) => {
		element.style.padding = '0'
	});

  });
	
	if (loading)
		return (
			<Flex
				style={{
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<p>Loading...</p>
				<Spin />
			</Flex>
		);

	return (
		<>
			<AntCalendar
				fullscreen={false}
				style={{
					width: '100%',
					maxWidth: '400px',
					height: 'auto',
					maxHeight: '400px',
					aspectRatio: '1 / 1',
				}}
				validRange={validRange}
				dateFullCellRender={cellRender}
				headerRender={headerRender}
			/>
			<Row justify="space-between" align="middle" style={{
				padding: 16,
				position: 'absolute',
				bottom: 0,
				width: '100%',
				color: 'lightgray',
			}}>
		 		Total : {convertDurationToHoursMinutes(durations.total)}
		 	</Row>
		</>
	);
};

export default Calendar;