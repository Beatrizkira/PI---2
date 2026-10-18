export const parseBRL = (value: number | string): number => {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError('Invalid amount for BRL formatting');
    }
    return value;
  }

  const numericValue = value.trim().replace(/[^\d,.-]/g, '');
  const lastComma = numericValue.lastIndexOf(',');
  const lastPeriod = numericValue.lastIndexOf('.');
  let normalizedValue = numericValue;

  if (lastComma >= 0 && lastPeriod >= 0) {
    normalizedValue = lastComma > lastPeriod
      ? numericValue.replace(/\./g, '').replace(',', '.')
      : numericValue.replace(/,/g, '');
  } else if (lastComma >= 0) {
    normalizedValue = /,\d{1,2}$/.test(numericValue)
      ? numericValue.replace(',', '.')
      : numericValue.replace(/,/g, '');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(numericValue)) {
    normalizedValue = numericValue.replace(/\./g, '');
  }

  const amount = Number(normalizedValue);
  if (!Number.isFinite(amount)) {
    throw new TypeError('Invalid amount for BRL formatting');
  }

  return amount;
};

export const formatBRL = (value: number | string): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parseBRL(value));
};
