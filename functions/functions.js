import { promises as fs } from "fs";

let states;
let cities;
let citiesPerState = [];

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
  showLongestNameOfBrazil();
}

async function showState(uf) {
  const data = JSON.parse(
    await fs.readFile(`./states/${uf.toUpperCase()}.json`)
  );
  console.log("Iniciando aplicação...");
  console.log(`${data.nome} tem ${data.cidades.length} municípios`);
}

function showMorePopulated() {
  let citiesMappedPerState = citiesPerState.map((state) => {
    return {
      uf: state.sigla,
      quantidade: state.quantidadeCidades,
    };
  });

  console.log(
    "Estados que possuem mais cidades, seguidos da quantidade, em ordem decrescente",
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
    "Estados que possuem menos cidades, seguidos da quantidade, em ordem decrescente",
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

  console.log("Cidades com os nomes mais longos de cada estado:");
  console.log(longestNamePerState);
}

function showShortestNames() {
  let shortestNamePerState = [];

  shortestNamePerState = citiesPerState.map((state) => {
    let shortestname = "cidade com nome longo";

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

  console.log("Cidades com os nomes mais curtos de cada estado:");
  console.log(shortestNamePerState);
}

function showLongestNameOfBrazil() {
  let longestNameOfBrazil = [];

  longestNameOfBrazil = citiesPerState.map((state) => {
    let longestName = "";

    state.cidades.forEach((cidade) => {
      if (cidade.Nome.length > longestName.length) {
        longestName = cidade.Nome;
      }
    });

    return {
      cidade: longestName,
      uf: state.sigla,
    };
  });

  longestNameOfBrazil = longestNameOfBrazil
    .sort((a, b) => b.cidade.length - a.cidade.length)
    .slice(0, 1);

  console.log("Cidade de maior nome entre todos estados:");
  console.log(longestNameOfBrazil);
}

export default {
  createStatesJson,
  showState,
};
