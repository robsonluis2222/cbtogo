import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://pontosbb.x10.mx/cbtogo',
  timeout: 10000,
});