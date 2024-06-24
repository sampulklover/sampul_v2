import adminStyles from '../styles/admin.module.scss';
import Loading from './Laoding';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const AccountsChart = ({ summary }) => {
  const [chartData, setChartData] = useState({
    digital_account: [],
    subscription_account: [],
    count_value_digital: 0,
    count_value_subscription: 0,
  });
  const [chartSeries, setChartSeries] = useState([0, 0]);

  useEffect(() => {
    if (summary.data.profiles.length !== 0) {
      const singleData = {
        digital_account: [],
        subscription_account: [],
        count_value_digital: 0,
        count_value_subscription: 0,
      };

      summary.data.profiles.forEach((profile) => {
        profile.digital_assets.forEach((asset) => {
          if (asset.account_type === 'non_subscription') {
            singleData.digital_account.push(asset);
          }
          if (asset.account_type === 'subscription') {
            singleData.subscription_account.push(asset);
          }
        });
      });

      singleData.count_value_digital = singleData.digital_account.reduce(
        (acc, val) => acc + val.declared_value_myr,
        0
      );

      const totalSubValue = singleData.subscription_account.reduce(
        (acc, val) => {
          const valueToAdd =
            val.frequency === 'yearly'
              ? val.declared_value_myr * 1
              : val.declared_value_myr * 12;
          return acc + valueToAdd;
        },
        0
      );

      singleData.count_value_subscription = totalSubValue;
      setChartData(singleData);
      const digitalPercentage = convertValue(
        'digital',
        singleData.count_value_digital,
        singleData.count_value_subscription
      )?.percentage;
      const subscriptionPercentage = convertValue(
        'subscription',
        singleData.count_value_digital,
        singleData.count_value_subscription
      )?.percentage;

      setChartSeries([digitalPercentage, subscriptionPercentage]);
    }
  }, [summary.data.profiles]);

  const chartOptions = {
    chart: {
      height: 280,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        // hollow: {
        //   margin: 15,
        //   size: '70%',
        // },
        dataLabels: {
          showOn: 'always',
          total: {
            show: true,
            label: 'TOTAL',
          },
          name: {
            offsetY: -10,
            show: true,
            color: '#475467',
            fontSize: '14px',
          },
          value: {
            color: '#101828',
            fontSize: '30px',
            show: true,
          },
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Assets', 'Expenses'],
    colors: ['#2F1DA9', '#3118D3'],
  };

  const convertValue = (
    type = 'digital',
    digitalValue = 0,
    subscriptionValue = 0
  ) => {
    const totalValue = digitalValue + subscriptionValue;

    var valueConfig = {
      digital: {
        currencyValue: `RM ${digitalValue.toLocaleString()}`,
        percentage: parseFloat(((digitalValue / totalValue) * 100).toFixed(2)),
      },
      subscription: {
        currencyValue: `RM ${subscriptionValue.toLocaleString()}`,
        percentage: parseFloat(
          ((subscriptionValue / totalValue) * 100).toFixed(2)
        ),
      },
    };

    return {
      currencyValue: valueConfig[type].currencyValue,
      percentage: valueConfig[type].percentage,
    };
  };

  return (
    <div class="mt-3">
      <Loading loading={summary.isLoading} />
      <div class="table-responsive">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          height={350}
        />
      </div>
      <div class="row">
        <div class="col d-flex justify-content-center">
          <div>
            <div class={adminStyles.radialChartLabelContainer}>
              <div class={adminStyles.assetsPointCircle} />
              <span class={adminStyles.radialChartLabelTitle}>Assets</span>
            </div>
            <p class={adminStyles.radialChartLabelValue}>
              {
                convertValue(
                  'digital',
                  chartData.count_value_digital,
                  chartData.count_value_subscription
                )?.currencyValue
              }
            </p>
          </div>
        </div>
        <div class="col d-flex justify-content-center">
          <div>
            <div class={adminStyles.radialChartLabelContainer}>
              <div class={adminStyles.expensesPointCircle} />
              <span class={adminStyles.radialChartLabelTitle}>Expenses</span>
            </div>
            <p class={adminStyles.radialChartLabelValue}>
              {
                convertValue(
                  'subscription',
                  chartData.count_value_digital,
                  chartData.count_value_subscription
                )?.currencyValue
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsChart;

// The summary of this page includes:
// This page serves financial data using charts and values.
// When the page loads, it fetches data and calculates totals for different types of accounts—digital and subscription-based.
// These calculations are then used to generate a radial chart showing percentages of assets and expenses.
// The chart's design includes labels and values formatted for clarity.
