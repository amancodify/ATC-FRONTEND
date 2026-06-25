const getCellValue = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0 ? parseFloat(numericValue.toFixed(2)) : '';
};

export const formatProductLabel = (key) => {
    if (typeof key !== 'string') {
        return 'Product';
    }

    const trimmedKey = key.trim();
    if (!trimmedKey) {
        return 'Product';
    }

    const normalized = trimmedKey
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const buildExcelReportData = (fetchedData = []) => {
    const productKeys = Array.from(
        (fetchedData || []).reduce((productSet, item) => {
            const productWiseData = item?.productWiseData || {};
            Object.keys(productWiseData).forEach((key) => productSet.add(key));
            return productSet;
        }, new Set())
    ).sort((a, b) => a.localeCompare(b));

    const columns = [
        { title: 'Party Code', width: { wpx: 90 } },
        { title: 'Firm Name', width: { wpx: 200 } },
        { title: 'Area', width: { wpx: 120 } },
        ...productKeys.flatMap((productKey) => [
            { title: `${formatProductLabel(productKey)} Pending`, width: { wpx: 120 } },
            { title: `${formatProductLabel(productKey)} Advance`, width: { wpx: 120 } },
        ]),
        { title: 'Total Advance', width: { wpx: 120 } },
        { title: 'Total Pending', width: { wpx: 120 } },
        { title: 'Outstanding', width: { wpx: 120 } },
    ];

    const data = (fetchedData || []).map((item) => {
        const {
            outstanding,
            partyData = {},
            productWiseData = {},
            totalAdvance = 0,
            totalPending = 0,
        } = item || {};

        const row = [
            { value: partyData.party_code || '' },
            { value: partyData.firm_name || '' },
            { value: partyData.dealer_area || '' },
        ];

        productKeys.forEach((productKey) => {
            const productData = productWiseData[productKey] || {};
            row.push({ value: getCellValue(productData.pending) });
            row.push({ value: getCellValue(productData.advance) });
        });

        row.push(
            { value: getCellValue(totalAdvance) },
            { value: getCellValue(totalPending) },
            { value: getCellValue(outstanding) }
        );

        return row.map((cell) => ({
            ...cell,
            style: { font: { sz: '12' }, alignment: { horizontal: 'center' } },
        }));
    });

    return { columns, data };
};
