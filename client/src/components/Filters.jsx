const Filters = ({ filters, onFilterChange }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const months = [
        { value: '', label: 'All Months' },
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className="flex gap-2 flex-wrap">
            <select
                name="month"
                value={filters.month}
                onChange={handleChange}
                className="input-field w-40"
            >
                {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>

            <select
                name="year"
                value={filters.year}
                onChange={handleChange}
                className="input-field w-32"
            >
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
    );
};

export default Filters;
