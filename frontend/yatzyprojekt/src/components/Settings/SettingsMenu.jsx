import Heading from "../Heading";

export default function SettingsMenu({settings}){
    return <div className="z-0 absolute static right-24 bg-white border-gray-300 p-3 rounded-full bottom-24">
        <Heading size={3} className="text-gray-400">Inställningar</Heading>
        {settings}
    </div>
}