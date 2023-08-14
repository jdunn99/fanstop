import Input from "./ui/input";

export function Search() {
    return (
        <form className="relative w-full">
            <Input
                type="search"
                placeholder="Search FanStop"
                className="w-full sm:w-64"
            />
        </form>
    );
}
