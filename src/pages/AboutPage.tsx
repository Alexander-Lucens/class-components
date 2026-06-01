import Header from "../components/Header";
import ButtonComponent from "../components/ButtonComponent";
import { useAppContext } from "../context/useAppContext";

export default function AboutPage() {
  const { triggerError } = useAppContext();
  return (
    <>
      <Header />
        <main className="width-wrapper">
          <section className="results-panel">
            <div className="about-page">
              <h1>About PokéSearch</h1>
              <div className="about-content">
                
                <h3>Course</h3>
                <p>
                  This application was created as part of the React course at{" "}
                  <a
                    href="https://rs.school/courses/reactjs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    RS School
                  </a>
                  .
                </p>
                <br />
                <h3>Pokemon API</h3>
                <p>
                  All Pokémon data is fetched from the{" "}
                  <a
                    href="https://pokeapi.co"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PokéAPI
                  </a>
                  , a free and open-source Pokémon API.
                </p>
                <br />  

                <h3>Created by</h3>
                <p>
                  This application was created by{" "}
                  <a
                    href="https://github.com/olucens/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    olucens
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>
        </main>
        <ButtonComponent className="error-trigger" onClick={triggerError}>
          Trigger Error
        </ButtonComponent>
      </>
  );
}