import translations from '../constant/translations';
import { useLocale } from '../context/locale';
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
  const { locale } = useLocale();

  const [chartData, setChartData] = useState({
    assets_data: [],
    faraid_data: [],
    terminate_data: [],
    transfer_as_gift_data: [],
    settle_data: [],
    assets_data_count: 0,
    faraid_data_count: 0,
    terminate_data_count: 0,
    transfer_as_gift_data_count: 0,
    settle_data_count: 0,
    total_sum_all_type: 0,
  });
  const [chartSeries, setChartSeries] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (summary.data.profiles.length !== 0) {
      const singleData = {
        assets_data: [],
        insurance_data: [],
        faraid_data: [],
        terminate_data: [],
        transfer_as_gift_data: [],
        settle_data: [],
        assets_data_count: 0,
        faraid_data_count: 0,
        terminate_data_count: 0,
        transfer_as_gift_data_count: 0,
        settle_data_count: 0,
        total_sum_all_type: 0,
      };

      summary.data.profiles.forEach((profile) => {
        profile.digital_assets.forEach((asset) => {
          singleData.assets_data.push(asset);
        });
      });

      singleData.assets_data.map((item) => {
        if (item.instructions_after_death == 'faraid') {
          singleData.faraid_data.push(item);
        }
        if (item.instructions_after_death == 'terminate') {
          singleData.terminate_data.push(item);
        }
        if (item.instructions_after_death == 'transfer_as_gift') {
          singleData.transfer_as_gift_data.push(item);
        }
        if (item.instructions_after_death == 'settle') {
          singleData.settle_data.push(item);
        }
      });

      const countTotalDeclareValue = (passData) => {
        const result = passData.reduce(
          (acc, val) => acc + val.declared_value_myr,
          0
        );
        return result;
      };

      singleData.assets_data_count = countTotalDeclareValue(
        singleData.assets_data
      );
      singleData.faraid_data_count = countTotalDeclareValue(
        singleData.faraid_data
      );
      singleData.terminate_data_count = countTotalDeclareValue(
        singleData.terminate_data
      );
      singleData.transfer_as_gift_data_count = countTotalDeclareValue(
        singleData.transfer_as_gift_data
      );
      singleData.settle_data_count = countTotalDeclareValue(
        singleData.settle_data
      );

      singleData.total_sum_all_type =
        singleData.faraid_data_count +
        singleData.terminate_data_count +
        singleData.transfer_as_gift_data_count +
        singleData.settle_data_count;

      setChartData(singleData);

      setChartSeries([
        parseFloat(
          (
            (singleData.faraid_data_count / singleData.total_sum_all_type) *
            100
          ).toFixed(2)
        ),
        parseFloat(
          (
            (singleData.terminate_data_count / singleData.total_sum_all_type) *
            100
          ).toFixed(2)
        ),
        parseFloat(
          (
            (singleData.transfer_as_gift_data_count /
              singleData.total_sum_all_type) *
            100
          ).toFixed(2)
        ),
        parseFloat(
          (
            (singleData.settle_data_count / singleData.total_sum_all_type) *
            100
          ).toFixed(2)
        ),
      ]);
    }
  }, [summary.data.profiles]);

  const assetsConfig = {
    faraid: {
      title: 'Faraid',
      color: '#8d7ff0',
      value: chartData.faraid_data_count,
    },
    terminate: {
      title: 'Terminate',
      color: '#1e0f84',
      value: chartData.terminate_data_count,
    },
    gift: {
      title: 'Gift',
      color: '#533de8',
      value: chartData.transfer_as_gift_data_count,
    },
    settle: {
      title: 'Settle',
      color: '#ddd7fb',
      value: chartData.settle_data_count,
    },
  };

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
            show: false,
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
    labels: [
      assetsConfig.faraid.title,
      assetsConfig.terminate.title,
      assetsConfig.gift.title,
      assetsConfig.settle.title,
    ],
    colors: [
      assetsConfig.faraid.color,
      assetsConfig.terminate.color,
      assetsConfig.gift.color,
      assetsConfig.settle.color,
    ],
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
        <div class="col">
          <div>
            <div class={adminStyles.radialChartLabelContainer}>
              <span class={adminStyles.radialChartLabelTitle}>Total Count</span>
            </div>
            <p class={adminStyles.radialChartLabelValue}>
              {chartData.assets_data.length}
            </p>
          </div>
        </div>
        <div class="col">
          <div>
            <div class={adminStyles.radialChartLabelContainer}>
              <span class={adminStyles.radialChartLabelTitle}>Total Value</span>
            </div>
            <p class={adminStyles.radialChartLabelValue}>
              {`RM ${chartData.assets_data_count.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>
      <div>
        {Object.entries(assetsConfig)
          .reduce((rows, [key, value], index) => {
            // Create a new row every 2 items
            if (index % 2 === 0) {
              rows.push([]); // Start a new row
            }
            rows[rows.length - 1].push(
              <div className="col" key={key}>
                <div className={adminStyles.radialChartLabelContainer}>
                  <div
                    className={adminStyles.assetsPointCircle}
                    style={{ backgroundColor: assetsConfig[key].color }} // Set the background color dynamically
                  />
                  <span className={adminStyles.radialChartLabelTitle}>
                    {assetsConfig[key].title}
                  </span>
                </div>
                <p className={adminStyles.radialChartLabelValue}>
                  {`RM ${assetsConfig[key].value.toLocaleString() || 0}`}{' '}
                </p>
              </div>
            );
            return rows;
          }, [])
          .map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row}
            </div>
          ))}
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
