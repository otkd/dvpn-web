/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { SessionStats } from 'mysterium-vpn-js';
import { Config } from 'mysterium-vpn-js/lib/config/config';
import { useSnackbar } from 'notistack';

import { ReactComponent as Logo } from '../../../assets/images/authenticated/pages/dashboard/logo.svg';
import Header from '../../../Components/Header';
import { RootState } from '../../../redux/store';
import { fetchIdentity, GeneralState } from '../../../redux/actions/general';
import { SSEState } from '../../../redux/actions/sse';
import SessionSidebar from '../SessionSidebar/SessionSidebar';
import { tequilapiClient } from '../../../api/TequilApiClient';
import { parseMessage } from '../../../commons/error.utils';

import './Dashboard.scss';
import Charts from './Charts/Charts';
import NatStatus from './NatStatus/NatStatus';
import Services from './Services/Services';
import Statistics from './Statistics/Statistics';

interface Props {
    general: GeneralState;
    sse: SSEState;
    fetchIdentity: () => void;
}

const mapStateToProps = (state: RootState) => ({
    general: state.general,
    sse: state.sse,
});

const mapDispatchToProps = {
    fetchIdentity,
};

interface StateProps {
    sessionStats: SessionStats;
    sessionStatsDaily: {
        [date: string]: SessionStats;
    };
    userConfig: Config;
}

const Dashboard: React.FC<Props> = ({ fetchIdentity, general, sse }) => {
    const [state, setState] = useState<StateProps>({
        sessionStats: {
            count: 0,
            countConsumers: 0,
            sumBytesReceived: 0,
            sumBytesSent: 0,
            sumDuration: 0,
            sumTokens: 0,
        },
        sessionStatsDaily: {},
        userConfig: { data: {} },
    });

    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        fetchIdentity();

        Promise.all([tequilapiClient.sessions(), tequilapiClient.userConfig()])
            .then((result) => {
                const [{ stats, statsDaily }, config] = result;
                setState({
                    ...state,
                    sessionStats: stats,
                    sessionStatsDaily: statsDaily,
                    userConfig: config,
                });
            })
            .catch((err) => {
                enqueueSnackbar(parseMessage(err), { variant: 'error' });
                console.log(err);
            });
    }, []);

    const { currentIdentity } = general;
    const { appState } = sse;
    if (!currentIdentity || !appState) {
        return <CircularProgress className="spinner" />;
    }

    const serviceInfo = appState.serviceInfo;
    const { status } = appState.natStatus;

    return (
        <div className="main">
            <div className="main-block main-block--split">
                <Header logo={Logo} name="Dashboard" />
                <div className="dashboard__statistics">
                    <Statistics stats={state.sessionStats} />
                </div>
                <div className="dashboard__charts">
                    <Charts statsDaily={state.sessionStatsDaily} />
                </div>
                <div className="dashboard__services">
                    <div className="services-header">
                        <p className="services-header__title">Services</p>
                        <div className="services-header__status">
                            <NatStatus status={status} />
                        </div>
                    </div>
                    <Services
                        identityRef={currentIdentity.id}
                        servicesInfos={serviceInfo}
                        userConfig={state.userConfig}
                    />
                </div>
            </div>
            <div className="sidebar-block">
                <SessionSidebar headerText="Latest Sessions" displayNavigation />
            </div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
