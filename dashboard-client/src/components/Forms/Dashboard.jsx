import React from 'react';

import './Dashboard.css';

export function Container({ children, headerText, sections }) {
    
    var Sections = [];

    if(sections) {
        for (const key in sections) Sections.push(
            <Section labelText={key} key={key}>
                {sections[key]}
            </Section>
        )
    }

    return (
        <div className='dashboard-input-container'>
            {headerText && (<Header text={headerText} />)}

            {(Sections) && Sections}

            {children}
        </div>
    );
}

export function Header({ text }) {
    return (
        <h3 className='dashboard-input-container-header'>{text}</h3>
    );
}

export function Label({ text }) {
    return (
        <p className='dashboard-input-label'>{text}</p>
    );
}

export function Section({ labelText, children }) {
    return (
        <div className='dashboard-input-section'>
            {labelText && (<Label text={labelText} />)}
            {children}
        </div>
    );
}