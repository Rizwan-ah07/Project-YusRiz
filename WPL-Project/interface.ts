export interface Pokemon {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    sprites: {
        other: {
            'official-artwork': {
                front_default: string;
            }
        }
    };
    stats: { stat: { name: string }, base_stat: number }[];
    abilities: { ability: { name: string } }[];
}

export interface Generation {
    results: { name: string }[];
}

export interface Type {
    results: { name: string }[];
}

export interface EvolutionDetails {
    species: {
      name: string;
      url: string;
    };
    evolves_to: EvolutionDetails[];
  }
  
 export interface EvolutionChain {
    chain: EvolutionDetails;
  }

  export interface PokemonDetails extends Pokemon {
    image: string;
}
  
