import { useCallback, useState } from "react";
import IconTrending from "../components/IconTrending";
import IconHiddenGems from "../components/IconHiddenGems";
import IconPeople from "../components/IconPeople";
import IconGlobe from "../components/IconGlobe";
import SearchFilter from "../components/SearchFilter";

export default function SpecialSearchFilters() {
    const [value, setValue] = useState("none");
    const options = [
        {
            Icon: IconGlobe,
            label: "Normal",
            onClick: () => {},
            value: "none",
        },
        {
            Icon: IconPeople,
            label: "Newcomers",
            onClick: () => {},
            value: "newcomer",
        },
        {
            Icon: IconTrending,
            label: "Trending 24h",
            onClick: () => {},
            value: "trending24",
        },
        {
            Icon: IconTrending,
            label: "Trending",
            onClick: () => {},
            value: "trending",
        },
        {
            Icon: IconHiddenGems,
            label: "Hidden Gems",
            onClick: () => {},
            value: "hidden_gems",
        },
    ];

    const onChangeTab = useCallback((value: any) => {
        setValue(value);
        wnd.Janitor.Search.SpecialMode = value;
        wnd.Janitor.Stores.searchStore.page = 1
        wnd.Janitor.Stores.searchStore.charactersListStore.getCharacters({page: 1, ...wnd.Janitor.Stores.searchStore.searchParams})
    }, [options, value]);

    return <SearchFilter options={options} value={value} onChangeTab={onChangeTab} />;
}
