/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import "./Statistic.scss"

interface Props {
    stat: string;
    name: string;
}

const StatCard: React.FC<Props> = ({ stat, name }) => {
    return (
        <div className="statistic">
            <p className="statistic__value">{stat}</p>
            <p className="statistic__label">{name}</p>
        </div>
    );
};

export default StatCard;