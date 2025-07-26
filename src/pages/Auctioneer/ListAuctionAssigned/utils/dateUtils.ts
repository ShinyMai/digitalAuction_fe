// Utility functions for date handling
export const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY') => {
    const dateObj = new Date(date);
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'HH:mm':
            return `${hours}:${minutes}`;
        case 'DD/MM/YYYY HH:mm':
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        default:
            return dateObj.toLocaleDateString('vi-VN');
    }
};

export const isSameDay = (date1: string | Date, date2: string | Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

export const isSameMonth = (date1: string | Date, date2: string | Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth();
};
