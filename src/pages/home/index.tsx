import { useAppDispatch, useAppSelector } from 'store';
import { pokemonActions, pokemonService } from 'store/pokemon';

const { increment, decrement } = pokemonActions;
const { useGetPokemonByNameQuery } = pokemonService;

const Home = () => {
  const { value } = useAppSelector(state => state.pokemon);
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetPokemonByNameQuery('');

  return (
    <div>
      {isLoading ? (
        <span>Loading</span>
      ) : (
        <>
          <h3>{data?.species.name}</h3>
          <img src={data?.sprites.front_shiny} alt={data?.species.name} />
        </>
      )}
      <span>{value}</span>
      <div>
        <button aria-label='Increment value' onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button aria-label='Decrement value' onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Home;
