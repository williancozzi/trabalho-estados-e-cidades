import { promises as fs } from "fs";

let states;
let cities;
let citiesPerState = [];
let longestNameOfBrazil = [];
let shortestNameOfBrazil = [];

async function readStatesJson() {
  try {
    return JSON.parse(await fs.readFile("./src/Estados.json"));
  } catch (error) {
    console.log(error);
  }
}

async function readCitiesJson() {
  try {
    return JSON.parse(await fs.readFile("./src/Cidades.json"));
  } catch (error) {
    console.log(error);
  }
}

async function createStatesJson() {
  states = await readStatesJson();
  cities = await readCitiesJson();

  states.map((state) => {
    let stateCities = cities.filter((city) => {
      return city.Estado === state.ID;
    });

    let mappedStates = {
      id: state.ID,
      sigla: state.Sigla,
      nome: state.Nome,
      quantidadeCidades: stateCities.length,
      cidades: stateCities,
    };

    citiesPerState.push(mappedStates);
    fs.writeFile(`./states/${state.Sigla}.json`, JSON.stringify(mappedStates));
  });

  showMorePopulated();
  showLessPopulated();
  showLongestNames();
  showShortestNames();
  showLongestNameOfBrazil(true);
  showShortestNameOfBrazil();
}

async function showState(uf) {
  const data = JSON.parse(
    await fs.readFile(`./states/${uf.toUpperCase()}.json`)
  );
  console.log(`2 - ${data.nome} tem ${data.cidades.length} municípios`);
}

function showMorePopulated() {
  let citiesMappedPerState = citiesPerState.map((state) => {
    return {
      uf: state.sigla,
      quantidade: state.quantidadeCidades,
    };
  });

  console.log(
    "3 - Estados que possuem mais cidades, seguidos da quantidade, em ordem decrescente",
    citiesMappedPerState.sort((a, b) => b.quantidade - a.quantidade).slice(0, 5)
  );
}

function showLessPopulated() {
  let citiesMappedPerState = citiesPerState.map((state) => {
    return {
      uf: state.sigla,
      quantidade: state.quantidadeCidades,
    };
  });

  console.log(
    "4 - Estados que possuem menos cidades, seguidos da quantidade, em ordem decrescente",
    citiesMappedPerState
      .sort((a, b) => a.quantidade - b.quantidade)
      .slice(0, 5)
      .sort((a, b) => b.quantidade - a.quantidade)
  );
}

function showLongestNames() {
  let longestNamePerState = [];

  longestNamePerState = citiesPerState.map((state) => {
    let longestName = "";

    state.cidades.forEach((cidade) => {
      if (cidade.Nome.length > longestName.length) {
        longestName = cidade.Nome;
      } else if (cidade.Nome.length === longestName.length) {
        longestNamePerState.sort((a, b) => a.nome - b.nome);
      }
    });

    return {
      cidade: longestName,
      uf: state.sigla,
    };
  });

  longestNameOfBrazil = longestNamePerState;
  console.log("5 - Cidades com os nomes mais longos de cada estado:");
  console.log(longestNamePerState);
}

function showShortestNames() {
  let shortestNamePerState = [];

  shortestNamePerState = citiesPerState.map((state) => {
    let shortestname = showLongestNameOfBrazil(false);

    state.cidades.forEach((cidade) => {
      if (cidade.Nome.length < shortestname.length) {
        shortestname = cidade.Nome;
      } else if (cidade.Nome.length === shortestname.length) {
        shortestNamePerState.sort((a, b) => a.nome - b.nome);
      }
    });

    return {
      cidade: shortestname,
      uf: state.sigla,
    };
  });

  shortestNameOfBrazil = shortestNamePerState;
  console.log("6 - Cidades com os nomes mais curtos de cada estado:");
  console.log(shortestNamePerState);
}

function showLongestNameOfBrazil(show) {
  longestNameOfBrazil.sort((a, b) => b.cidade.length - a.cidade.length);

  if (show) {
    console.log("7 - Cidade de maior nome entre todos estados:");
    console.log(longestNameOfBrazil[0]);
  }

  return longestNameOfBrazil[0].cidade;
}

function showShortestNameOfBrazil() {
  shortestNameOfBrazil
    .sort((a, b) => a.cidade.localeCompare(b.cidade))
    .sort((a, b) => a.cidade.length - b.cidade.length);

  console.log("8 - Cidade de menor nome entre todos estados:");
  console.log(shortestNameOfBrazil[0]);
}

export default {
  createStatesJson,
  showState,
};
