export const API_BASE =
  import.meta.env.MODE === 'development'
    ? '/api'
    : 'https://oilerrig.westeurope.cloudapp.azure.com';
