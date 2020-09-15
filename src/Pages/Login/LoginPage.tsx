/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { FormEvent } from 'react';
import Collapse from '@material-ui/core/Collapse';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useHistory } from 'react-router';

import { DASHBOARD } from '../../constants/routes';
import sideImageOnboarding from '../../assets/images/onboarding/SideImage.png';
import '../../assets/styles/pages/login/main.scss';
import { DefaultTextField } from '../../Components/DefaultTextField';
import { DEFAULT_USERNAME } from '../../constants/defaults';
import LoadingButton from '../../Components/Buttons/LoadingButton';
import { tequilapiClient } from '../../api/TequilApiClient';
import {loginAndStoreCurrentIdentity} from "../../api/TequilAPIWrapper";

interface StateInterface {
    password: string;
    error: boolean;
    isLoading: boolean;
}

const LoginPage = () => {
    const [state, setState] = React.useState<StateInterface>({
        password: '',
        error: false,
        isLoading: false,
    });
    const history = useHistory();

    const handleTextFieldsChange = (prop: keyof StateInterface) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [prop]: event.target.value });
    };

    const handleLogin = (e: FormEvent<any>) => {
        e.preventDefault();
        setState({ ...state, error: false, isLoading: true });
        loginAndStoreCurrentIdentity(DEFAULT_USERNAME, state.password)
            .then(() => history.push(DASHBOARD))
            .catch(() => setState({ ...state, error: true, isLoading: false }));
    };
    return (
        <div className="login wrapper">
            <div className="login-content">
                <div className="login-content-block">
                    <h1 className="login-content-block--heading">Welcome node runner!</h1>
                    <p className="login-content-block--heading-paragraph">Lets get you up and running. </p>
                    <div className="login-content-block--password-block">
                        <Collapse in={state.error}>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                Bad credentials
                            </Alert>
                        </Collapse>
                        <form onSubmit={handleLogin}>
                            <div className="password-input-block">
                                <p className="text-field-label">Web UI password</p>
                                <DefaultTextField
                                    handleChange={handleTextFieldsChange}
                                    password={true}
                                    value={state.password}
                                    stateName="password"
                                />
                            </div>

                            <div className="password-actions-block">
                                <a href="#">Forgot password?</a>
                                <LoadingButton
                                    type="submit"
                                    isLoading={state.isLoading}
                                    className="btn btn-filled login"
                                >
                                    <span className="btn-text-white">Sing In</span>
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="side">
                <img alt="onboarding" src={sideImageOnboarding} />
            </div>
        </div>
    );
};

export default LoginPage;