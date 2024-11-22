export const styleSelect = {
  control: (provided) => ({
    ...provided,
    minWidth: '350px',
    maxWidth: '250px',
    borderColor: '#666',
    borderWidth: '1px',
    minHeight: '0%',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#8b8b8b',
    },
    '&:focus-within': {
      border: '1px solid #000',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#e6e6e6' : 'white',
    color: state.isSelected ? '#333333' : '#555555',
    padding: 10,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#999999',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#333333',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#666',
    padding: '0 6px',
    '&:hover': {
      color: '#333333',
    }
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: '0 6px',
    '&:hover': {
      color: '#333333',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px',
  }),
};