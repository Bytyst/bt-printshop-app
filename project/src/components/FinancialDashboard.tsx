import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';

interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const mockFinancialData: FinancialData[] = [
  { month: 'Jan', revenue: 1200, expenses: 400, profit: 800 },
  { month: 'Feb', revenue: 1400, expenses: 500, profit: 900 },
  { month: 'Mar', revenue: 1600, expenses: 650, profit: 950 },
  { month: 'Apr', revenue: 1550, expenses: 600, profit: 950 },
  { month: 'May', revenue: 1750, expenses: 550, profit: 1200 },
  { month: 'Jun', revenue: 1900, expenses: 700, profit: 1200 },
  { month: 'Jul', revenue: 915, expenses: 290, profit: 625 },
];

const recentRevenue = [
  {
    id: '1',
    customer: 'Maria Restaurant',
    invoice: 'INV002',
    amount: 450,
    status: 'Paid'
  },
  {
    id: '2',
    customer: 'Tech Startup',
    invoice: 'INV003',
    amount: 890,
    status: 'Paid'
  }
];

const expenseCategories = [
  { name: 'Materials', amount: 180, percentage: 62, color: 'from-primary-teal to-primary-teal-dark' },
  { name: 'Labor', amount: 70, percentage: 24, color: 'from-secondary-charcoal-light to-secondary-charcoal' },
  { name: 'Equipment', amount: 25, percentage: 9, color: 'from-primary-teal-accent to-primary-teal-light' },
  { name: 'Utilities', amount: 15, percentage: 5, color: 'from-neutral-gray-light to-neutral-gray-medium' },
];

export default function FinancialDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  
  const currentMonth = mockFinancialData[mockFinancialData.length - 1];
  const maxRevenue = Math.max(...mockFinancialData.map(d => d.revenue));
  const totalRevenue = mockFinancialData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = mockFinancialData.reduce((sum, data) => sum + data.expenses, 0);
  const totalProfit = mockFinancialData.reduce((sum, data) => sum + data.profit, 0);

  return (
    <div className="space-y-6">
      {/* Header with dual-tone background */}
      <div className="bg-primary-teal rounded-lg p-8 text-neutral-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
            <p className="text-neutral-white opacity-90 text-lg">Track revenue, expenses, and profitability</p>
          </div>
          <div className="bg-primary-teal-dark rounded-lg p-4">
            <PieChart className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* KPI Cards with dual-tone design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-primary-teal rounded-lg shadow-lg p-6 text-neutral-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-white opacity-80 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-neutral-white opacity-80 text-sm mt-1">YTD</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+15% vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-primary-teal-dark">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-secondary-charcoal rounded-lg shadow-lg p-6 text-neutral-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-white opacity-80 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
              <p className="text-neutral-white opacity-80 text-sm mt-1">YTD</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+8% vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-secondary-charcoal-light">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-primary-teal-light rounded-lg shadow-lg p-6 text-secondary-charcoal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-charcoal text-sm font-medium">Net Profit</p>
              <p className="text-3xl font-bold">${totalProfit.toLocaleString()}</p>
              <p className="text-secondary-charcoal text-sm mt-1">YTD</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1 text-primary-teal-dark" />
                <span className="text-sm font-medium text-primary-teal-dark">+22% vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-secondary-charcoal">
              <TrendingUp className="h-6 w-6 text-neutral-white" />
            </div>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-primary-teal-accent rounded-lg shadow-lg p-6 text-secondary-charcoal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-charcoal text-sm font-medium">Profit Margin</p>
              <p className="text-3xl font-bold">{((totalProfit / totalRevenue) * 100).toFixed(1)}%</p>
              <p className="text-secondary-charcoal text-sm mt-1">Average</p>
              <div className="w-full bg-neutral-gray-light rounded-full h-2 mt-2">
                <div 
                  className="bg-secondary-charcoal h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((totalProfit / totalRevenue) * 100), 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3 rounded-full bg-secondary-charcoal">
              <BarChart3 className="h-6 w-6 text-neutral-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="bg-neutral-white rounded-lg shadow-lg p-6 border border-primary-teal-accent">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-secondary-charcoal">Revenue vs Expenses</h3>
            <BarChart3 className="h-6 w-6 text-primary-teal" />
          </div>
          
          <div className="space-y-6">
            {mockFinancialData.map((data, index) => (
              <div key={data.month} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-secondary-charcoal w-12">{data.month}</span>
                  <span className="text-secondary-charcoal font-bold">${data.revenue}</span>
                </div>
                
                {/* Revenue Line */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-primary-teal-dark">Revenue</span>
                    <span className="text-secondary-charcoal font-bold">${data.revenue}</span>
                  </div>
                  <div className="w-full bg-neutral-gray-light rounded-full h-5">
                    <div 
                      className="h-5 rounded-full transition-all duration-700 ease-out bg-primary-teal"
                      style={{ 
                        width: `${(data.revenue / maxRevenue) * 100}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Expenses Line */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-secondary-charcoal">Expenses</span>
                    <span className="text-secondary-charcoal font-bold">${data.expenses}</span>
                  </div>
                  <div className="w-full bg-neutral-gray-light rounded-full h-5">
                    <div 
                      className="h-5 rounded-full transition-all duration-700 ease-out bg-secondary-charcoal"
                      style={{ 
                        width: `${(data.expenses / maxRevenue) * 100}%`,
                        animationDelay: `${index * 100 + 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-neutral-gray-medium font-semibold">
                  <span>Profit: ${data.profit}</span>
                  <span>Margin: {((data.profit / data.revenue) * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary-teal"></div>
              <span className="text-secondary-charcoal font-semibold">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-secondary-charcoal"></div>
              <span className="text-secondary-charcoal font-semibold">Expenses</span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-neutral-bg-light rounded-lg shadow-lg p-6 border border-primary-teal-accent">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-secondary-charcoal">Expense Breakdown</h3>
            <PieChart className="h-6 w-6 text-primary-teal" />
          </div>
          
          <div className="space-y-4">
            {expenseCategories.map((category, index) => (
              <div key={category.name} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-primary-teal"></div>
                    <span className="font-bold text-secondary-charcoal">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-secondary-charcoal">
                      ${category.amount}
                    </div>
                    <div className="text-sm text-neutral-gray-medium font-semibold">
                      {category.percentage}%
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-neutral-gray-light rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-700 ease-out bg-primary-teal"
                    style={{ 
                      width: `${category.percentage}%`,
                      animationDelay: `${index * 150}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-primary-teal-accent rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-secondary-charcoal">Total Monthly Expenses</span>
              <span className="text-xl font-bold text-secondary-charcoal">
                ${expenseCategories.reduce((sum, cat) => sum + cat.amount, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Revenue */}
      <div className="bg-secondary-charcoal rounded-lg shadow-lg p-6 text-neutral-white">
        <h3 className="text-xl font-bold mb-6">Recent Revenue</h3>
        
        <div className="space-y-4">
          {recentRevenue.map((item) => (
            <div key={item.id} className="bg-primary-teal rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-white">{item.customer}</div>
                  <div className="text-sm text-primary-teal-light">{item.invoice}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-white">+${item.amount}</div>
                  <div className="text-sm font-semibold text-primary-teal-light">{item.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Performance Summary */}
      <div className="bg-neutral-white rounded-lg shadow-lg p-6 border border-primary-teal-accent">
        <h3 className="text-xl font-bold text-secondary-charcoal mb-6">Monthly Performance Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-primary-teal rounded-lg p-6 text-neutral-white">
            <div className="text-3xl font-bold mb-2">
              ${currentMonth.revenue}
            </div>
            <div className="text-neutral-white opacity-90 font-semibold">Current Month Revenue</div>
            <div className="text-sm text-neutral-white opacity-80 mt-2">
              Best: ${Math.max(...mockFinancialData.map(d => d.revenue))}
            </div>
          </div>
          
          <div className="text-center bg-primary-teal-accent rounded-lg p-6 text-secondary-charcoal">
            <div className="text-3xl font-bold mb-2">
              {((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1)}%
            </div>
            <div className="text-secondary-charcoal font-semibold">Current Profit Margin</div>
            <div className="text-sm text-secondary-charcoal mt-2">
              Target: 55% | Industry: 45%
            </div>
          </div>
          
          <div className="text-center bg-secondary-charcoal-light rounded-lg p-6 text-neutral-white">
            <div className="text-3xl font-bold mb-2">
              ${(totalRevenue / mockFinancialData.length).toFixed(0)}
            </div>
            <div className="text-neutral-white opacity-90 font-semibold">Average Monthly Revenue</div>
            <div className="text-sm text-neutral-white opacity-80 mt-2">
              Growth: +{(((currentMonth.revenue - mockFinancialData[0].revenue) / mockFinancialData[0].revenue) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}