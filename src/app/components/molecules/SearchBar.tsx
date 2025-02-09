"use client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SearchBar({ search, setSearch, handleSearch }: any) {
    return (
        <form onSubmit={handleSearch} className="mt-6 flex justify-center">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs or companies"
                className="w-2/3 px-4 py-2 rounded-l-lg text-black"
            />
            <button
                type="submit"
                className="bg-yellow-400 px-4 py-2 rounded-r-lg text-white hover:bg-yellow-500"
            >
                Search
            </button>
        </form>
    );
}
