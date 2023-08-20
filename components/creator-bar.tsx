import { BaseTag } from "@/pages/api/tags";
import React from "react";

interface CreatorBarProps {
    keys: BaseTag[];
    active: string;
    setActive(tag: string): void;
}
export function CreatorBar({ keys, active, setActive }: CreatorBarProps) {
    return (
        <div className="m-auto block bg-rose-50 px-2 relative flex-1 rounded-full space-x-2 py-1">
            {keys.map(({ name }) => (
                <div
                    key={name}
                    onClick={() => setActive(name)}
                    className={`inline-block cursor-pointer rounded-full hover:bg-white hover:text-rose-500  transition-colors ${
                        active === name ? "bg-white text-rose-500" : ""
                    } px-2`}
                >
                    <span className="text-sm font-semibold">{name}</span>
                </div>
            ))}
        </div>
    );
}
