import React from 'react';

import { Spinner, Alert, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { Dashboard, Confirm } from '../../components';

export function GuildDashboard({ guild }) {
    
    const [ prefix, setPrefix ] = React.useState('!');

    if(guild) {
        return (
            <main className='guild-dashboard-wrapper'>

                <div className='guild-dashboard-info'>
                    <p>{guild.name} - Settings</p>
                </div>

                <div className='guild-dashboard-form'>

                    <Formik
                        initialValues={{
                            prefix: prefix
                        }}

                        validate={(values) => {
                            const errors = {};

                            if(!values.prefix) errors.prefix = 'Prefix is required';
                            if(values.prefix.includes(' ')) errors.prefix = 'Invalid prefix! Prefix cannot have a space in it.';

                            return errors;
                        }}

                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                console.log(values);
                                setSubmitting(false);
                            }, 1000);
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                            isSubmitting,
                            resetForm
                        }) => (
                            <form onSubmit={handleSubmit}>

                                {(errors && Object.keys(errors).length > 0) && (
                                    <Alert variant='danger'>
                                        {(errors.prefix && touched.prefix) && errors.prefix}
                                    </Alert>
                                )}

                                <Dashboard.Container
                                    headerText='General Settings'
                                    
                                    sections={{
                                        'Prefix': (
                                            <Form.Control type='text' name='prefix' onChange={handleChange} value={values.prefix} />
                                        ),
                                        'Setting 1': (
                                            <Form.Control type='text' name='setting1' onChange={handleChange} />
                                        ),
                                        'Setting 2': (
                                            <Form.Control as='select' name='setting2' onChange={handleChange}>
                                                <option>option 1</option>
                                                <option>option 2</option>
                                                <option>option 3</option>
                                                <option>option 4</option>
                                            </Form.Control>
                                        )
                                    }}
                                />

                                <Dashboard.Container
                                    headerText='Some Other Settings'

                                    sections={{
                                        'Setting 3': (
                                            <Form.Control type='text' name='setting3' onChange={handleChange} />
                                        )
                                    }}
                                />

                                <Confirm isBtnDisabled={isSubmitting} resetAction={resetForm} />

                            </form>
                        )}
                    </Formik>

                </div>

            </main>
        );
    }
    else {
        // still loading
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }
}