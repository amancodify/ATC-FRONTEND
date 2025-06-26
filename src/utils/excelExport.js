import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Excel export utility using SheetJS (xlsx)
 * Replaces react-data-export functionality
 */

export const exportToExcel = (data, filename = 'export') => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Add worksheets
    data.forEach((sheet) => {
        const { name, columns, data: sheetData } = sheet;
        
        // Prepare data for worksheet
        const worksheetData = [];
        
        // Add headers if columns are defined
        if (columns) {
            worksheetData.push(columns.map(col => col.title || col));
        }
        
        // Add data rows
        sheetData.forEach(row => {
            const rowData = row.map(cell => {
                if (typeof cell === 'object' && cell.value !== undefined) {
                    return cell.value;
                }
                return cell;
            });
            worksheetData.push(rowData);
        });
        
        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        
        // Apply column widths if specified
        if (columns) {
            const colWidths = columns.map(col => {
                if (col.width && col.width.wpx) {
                    return { wpx: col.width.wpx };
                }
                return { wpx: 100 }; // default width
            });
            worksheet['!cols'] = colWidths;
        }
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, name || 'Sheet1');
    });
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Save file
    const fileData = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    saveAs(fileData, `${filename}.xlsx`);
};

/**
 * React component for Excel download button
 */
export const ExcelDownloadButton = ({ 
    data, 
    filename = 'export', 
    children, 
    className = '',
    style = {} 
}) => {
    const handleDownload = () => {
        exportToExcel(data, filename);
    };

    return (
        <div 
            onClick={handleDownload} 
            className={`cursor-pointer ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};

// Legacy compatibility components
export const ExcelFile = ({ element, filename, children }) => {
    const handleDownload = () => {
        if (children && children.props && children.props.dataSet) {
            exportToExcel(children.props.dataSet, filename);
        }
    };

    return (
        <div onClick={handleDownload}>
            {element}
        </div>
    );
};

export const ExcelSheet = ({ dataSet, name }) => {
    // This is just a placeholder component for compatibility
    // The actual export is handled by ExcelFile
    return null;
};

// Default export with compatibility structure
const ReactExport = {
    ExcelFile,
    ExcelSheet,
    exportToExcel,
    ExcelDownloadButton
};

export default ReactExport;
