import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import "./DatePickerCustom.css";

registerLocale("pt-BR", ptBR);

export default function DatePickerInput({ selected, onChange, placeholder = "Selecione a data", ...props }) {
  return (
    <div className="custom-datepicker-wrapper">
      <DatePicker
        selected={selected ? new Date(selected + 'T00:00:00') : null}
        onChange={(date) => {
            if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                onChange(`${year}-${month}-${day}`);
            } else {
                onChange("");
            }
        }}
        dateFormat="dd/MM/yyyy"
        locale="pt-BR"
        placeholderText={placeholder}
        className="custom-datepicker-input"
        showPopperArrow={false}
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        {...props}
      />
      <Calendar size={18} className="custom-datepicker-icon" />
    </div>
  );
}