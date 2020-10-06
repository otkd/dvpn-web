/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Session, SessionDirection, SessionListResponse } from 'mysterium-vpn-js';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import { tequilapiClient } from '../../../api/TequilApiClient';
import { ReactComponent as Logo } from '../../../assets/images/authenticated/pages/sessions/logo.svg';
import '../../../assets/styles/pages/sessionsList.scss';
import formatBytes from '../../../commons/formatBytes';
import { displayMyst } from '../../../commons/money.utils';
import secondsToISOTime from '../../../commons/secondsToISOTime';
import Header from '../../../Components/Header';
import Table, { TableRow } from '../../../Components/Table/Table';
import SessionSidebar from '../SessionSidebar/SessionSidebar';
import './Sessions.scss';
import { parseError } from '../../../commons/error.utils';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';

export interface Props {
    filterDirection?: SessionDirection;
    filterProviderId?: string;
}

const mapStateToProps = (state: RootState) => ({
    filterProviderId: state.app.currentIdentity?.id,
});

interface StateProps {
    isLoading: boolean;
    pageSize: number;
    sessionListResponse?: SessionListResponse;
    currentPage: number;
}

const row = (s: Session): TableRow => {
    const cells = [
        {
            className: 'w-10',
            content: s.consumerCountry,
        },
        {
            className: 'w-20',
            content: secondsToISOTime(s.duration),
        },
        {
            className: 'w-30',
            content: displayMyst(s.tokens),
        },
        {
            className: 'w-20',
            content: formatBytes(s.bytesReceived + s.bytesSent),
        },
        {
            className: 'w-30',
            content: s.id.split('-')[0],
        },
    ];

    return {
        key: s.id,
        cells: cells,
    };
};

const Sessions = ({ filterDirection = SessionDirection.PROVIDED, filterProviderId }: Props) => {
    const [state, setState] = useState<StateProps>({
        isLoading: true,
        pageSize: 10,
        currentPage: 1,
    });

    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        tequilapiClient
            .sessions({
                direction: filterDirection,
                providerId: filterProviderId,
                pageSize: state.pageSize,
                page: state.currentPage,
            })
            .then((resp) => {
                setState({ ...state, isLoading: false, sessionListResponse: resp });
            })
            .catch((err) => {
                enqueueSnackbar(parseError(err) || 'Fetching Sessions Failed!');
                console.log(err);
            });
    }, [state.pageSize, state.currentPage]);

    const { items = [], totalPages = 0 } = { ...state.sessionListResponse };

    const handlePrevPageButtonClick = () => {
        setState({ ...state, currentPage: state.currentPage - 1 });
    };

    const handleNextPageButtonClick = () => {
        setState({
            ...state,
            currentPage: state.currentPage + 1,
        });
    };

    const onPageClicked = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
        setState({ ...state, currentPage: pageNumber });
    };

    return (
        <div className="main">
            <div className="main-block main-block--split">
                <Header logo={Logo} name="Sessions" />
                <Table
                    headers={[
                        { name: 'Country', className: 'w-10' },
                        { name: 'Duration', className: 'w-20' },
                        { name: 'Earnings', className: 'w-30' },
                        { name: 'Transferred', className: 'w-20' },
                        { name: 'Session ID', className: 'w-30' },
                    ]}
                    rows={items.map(row)}
                    currentPage={state.currentPage}
                    lastPage={totalPages}
                    handlePrevPageButtonClick={handlePrevPageButtonClick}
                    handleNextPageButtonClick={handleNextPageButtonClick}
                    onPageClick={onPageClicked}
                />
            </div>
            <div className="sidebar-block">
                <SessionSidebar headerText="Live Sessions" liveSessionsOnly />
            </div>
        </div>
    );
};

export default connect(mapStateToProps)(Sessions);
