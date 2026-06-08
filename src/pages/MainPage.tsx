import { useLocation, useNavigate, useSearchParams, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Search from "../components/Search";
import CardList from "../components/CardList";
import ButtonComponent from "../components/ButtonComponent";
import useLocalStorage from "../hooks/useLocalStorage";
import { useAppContext } from "../context/useAppContext";
import {
    useGetPokemonPageQuery,
    useGetPokemonByTermQuery,
    getQueryErrorMessage,
} from "../services/pokemonApi";

const PAGE_SIZE = 20;

export default function MainPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { triggerError } = useAppContext();

    const isDetailsOpen = location.pathname.includes("/details/");
    const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

    const [searchTerm, setSearchTerm] = useLocalStorage("searchTerm", "");
    const trimmedTerm = searchTerm.trim();

    const {
        data: pageData,
        isLoading: pageLoading,
        isFetching: pageFetching,
        error: pageError,
        refetch: refetchPage,
    } = useGetPokemonPageQuery(
        { page: currentPage, pageSize: PAGE_SIZE },
        { skip: !!trimmedTerm },
    );

    const {
        data: searchData,
        isLoading: searchLoading,
        isFetching: searchFetching,
        error: searchError,
        refetch: refetchSearch,
    } = useGetPokemonByTermQuery(trimmedTerm, { skip: !trimmedTerm });

    const results = trimmedTerm
        ? (searchData ?? [])
        : (pageData?.results ?? []);
    const loading = trimmedTerm
        ? searchLoading || searchFetching
        : pageLoading || pageFetching;
    const error = trimmedTerm
        ? (searchError ? getQueryErrorMessage(searchError) : null)
        : (pageError ? getQueryErrorMessage(pageError) : null);
    const hasNext = !trimmedTerm && (pageData?.hasNext ?? false);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.trim()) {
            setSearchParams({ page: "1" });
        }
    };

    const handleRefresh = () => {
        if (trimmedTerm) {
            void refetchSearch();
        } else {
            void refetchPage();
        }
    };

    const handleCardClick = (pokemonName: string) => {
        navigate(`/details/${pokemonName}?page=${currentPage}`);
    };

    const handleCloseDetails = () => {
        navigate(`/?page=${currentPage}`);
    };

    const nextPage = () => {
        if (hasNext) {
            setSearchParams({ page: (currentPage + 1).toString() });
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setSearchParams({ page: (currentPage - 1).toString() });
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
            <Header />
            <div className="width-wrapper" style={{ display: "flex", flex: 1 }}>
                <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <section className="search-panel">
                        <Search onSearch={handleSearch} />
                        <ButtonComponent
                            className="btn-refresh"
                            onClick={handleRefresh}
                            disabled={loading}
                            aria-label="Refresh data"
                        >
                            Refresh
                        </ButtonComponent>
                    </section>

                    <section
                        className="results-panel"
                        style={{ flex: 1, overflowY: "auto" }}
                    >
                        <CardList
                            results={results}
                            loading={loading}
                            error={error}
                            onCardClick={handleCardClick}
                        />

                        {!loading && results.length > 0 && (
                            <div className="pagination">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <span>Page {currentPage}</span>
                                <button onClick={nextPage} disabled={!hasNext}>
                                    Next
                                </button>
                            </div>
                        )}
                    </section>

                    <ButtonComponent
                        className="error-trigger"
                        onClick={triggerError}
                    >
                        Trigger Error
                    </ButtonComponent>
                </main>

                {isDetailsOpen && (
                    <div className="details-wrapper">
                        <button
                            className="details-wrapper__close-btn"
                            onClick={handleCloseDetails}
                            title="Close details panel"
                            aria-label="Close details"
                        >
                            ×
                        </button>
                        <div className="details-wrapper__content">
                            <Outlet />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
