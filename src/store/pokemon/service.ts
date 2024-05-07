import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from 'store/customBaseQuery';
import * as api from './api';
import type { TPokemonRes } from './type';

export const pokemonService = createApi({
  reducerPath: 'pokemonService',
  baseQuery: customBaseQuery({ baseUrl: '' }),
  endpoints: builder => ({
    getPokemonByName: builder.query<TPokemonRes, {}>({
      query: params => ({
        url: `${api.getPokemonApi}/bulbasaur`,
        method: 'get',
        params
      })
    })
  })
});
