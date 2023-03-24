/* Root.jsx
Renderar saker som finns på alla sidor. */
import { Outlet } from "react-router-dom"
import { useState } from "react"
import useCookies from "react-cookie";
export default function Root() {
    const [selectedFont, useSelectedFont] = useCookies(["selected-font"])
    return <><Outlet/></>
}