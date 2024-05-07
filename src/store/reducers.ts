import pokemonReducer, { pokemonService } from 'store/pokemon';

// 导入reducer
export const reducers = {
  pokemon: pokemonReducer,
  // 注入 service
  [pokemonService.reducerPath]: pokemonService.reducer
};

// 注入 middleware
export const middlewares = [pokemonService.middleware];
