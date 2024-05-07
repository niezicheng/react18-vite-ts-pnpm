import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TPokemonState } from './type';

const initialState: TPokemonState = {
  value: 0
};

export const pokemonSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

export const pokemonActions = pokemonSlice.actions;
export default pokemonSlice.reducer;
