import React, { Children } from "react";

const Tool = ({nom, prenom, children}) => {
    return (
        <div>
            {children}
            <span>{nom}</span>
            <span>{prenom}</span>
        </div>
    )
}

export default Tool