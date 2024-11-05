import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Box, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { FaRegClock } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const datePickerStyles = `
  .date-picker {
    width: 100%;
    padding: 12px 40px;
    font-size: 1rem;
    border: none;
    border-radius: 0.375rem;
    outline: none;
    cursor: pointer;
  }
  
  .react-datepicker-wrapper {
    width: 100%;
    position: relative;
  }
  
  .react-datepicker__input-container {
    width: 100%;
  }
  
  .react-datepicker {
    font-family: inherit;
    border: 1px solid var(--chakra-colors-gray-200);
    border-radius: 0.375rem;
    box-shadow: var(--chakra-shadows-lg);
    z-index: 1000;
    background-color: white;
  }
  
  .react-datepicker__header {
    background-color: var(--chakra-colors-gray-50);
    border-bottom: 1px solid var(--chakra-colors-gray-200);
    border-radius: 0.375rem 0.375rem 0 0;
  }
  
  .react-datepicker__time-container {
    border-left: 1px solid var(--chakra-colors-gray-200);
    width: 100px;
  }
  
  .react-datepicker__time-list-item--selected {
    background-color: var(--chakra-colors-blue-500) !important;
    color: white !important;
  }
  
  .react-datepicker__day--selected {
    background-color: var(--chakra-colors-blue-500) !important;
    color: white !important;
  }
  
  .react-datepicker__day:hover {
    background-color: var(--chakra-colors-blue-100) !important;
  }
  
  .react-datepicker__day-name {
    color: var(--chakra-colors-gray-600);
  }

  .react-datepicker__day--disabled {
    color: var(--chakra-colors-gray-300) !important;
    cursor: not-allowed;
  }
  
  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__navigation {
    margin: 0 10px; /* 옆으로 이동하기 위한 마진 */
  }

  .react-datepicker-popper {
    z-index: 9999 !important;
  }
`;

interface CustomDatePickerProps {
  onChange: (date: Date | null) => void;
  iconColor: string;
  inputBg: string;
  inputHoverBg: string;
  value: Date | null;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onChange,
  iconColor,
  inputBg,
  inputHoverBg,
}) => {
  const now = new Date(); // 현재 시간
  const [selected, setSelected] = useState<Date | null>(now); // 기본값을 현재 시간으로 설정

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  // Filter available times to only show future times for today
  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    // Check if the selected date is today
    if (
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    ) {
      return currentDate.getTime() < selectedDate.getTime();
    }

    // If the selected date is not today (different month or year), allow all times
    return true;
  };

  useEffect(() => {
    onChange(selected); // 부모 컴포넌트에 상태 변경 알리기
  }, [selected, onChange]);

  return (
    <Box position="relative">
      <style>{datePickerStyles}</style>
      <InputGroup>
        <InputLeftElement pointerEvents="none" h="100%">
          <FaRegClock color={iconColor} />
        </InputLeftElement>
        <DatePicker
          selected={selected}
          onChange={(date) => setSelected(date)} // 선택한 날짜를 상태에 설정
          showTimeSelect
          dateFormat="MM/dd/yyyy h:mm aa"
          placeholderText="Select date and time"
          className="date-picker"
          wrapperClassName="date-picker-wrapper"
          timeIntervals={30}
          minDate={now}
          maxDate={maxDate}
          filterTime={filterPassedTime}
          customInput={
            <Input
              size="lg"
              bg={inputBg}
              border="none"
              _hover={{ bg: inputHoverBg }}
              _focus={{ bg: inputHoverBg, boxShadow: "none" }}
            />
          }
        />
      </InputGroup>
    </Box>
  );
};

export default CustomDatePicker;
