import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";

interface CalculatorState {
  bafogStatus: "receiving" | "not-receiving";
  insuranceStatus: "family" | "kvds" | "other";
  annualIncome: number;
  weeklyHours: number;
  bafogEntitlement: number;
}

interface QuizState {
  currentQuestion: number;
  result: string | null;
}

const BAFOEG_LIMIT = 6672;
const INSURANCE_HOURS_LIMIT = 20;
const TAX_FREE_ALLOWANCE = 12096;
const FAMILY_INSURANCE_MONTHLY_LIMIT = 538;

export default function Home() {
  const [calculator, setCalculator] = useState<CalculatorState>({
    bafogStatus: "receiving",
    insuranceStatus: "family",
    annualIncome: 5000,
    weeklyHours: 15,
    bafogEntitlement: 450,
  });

  const [quiz, setQuiz] = useState<QuizState>({
    currentQuestion: 0,
    result: null,
  });

  const [activeTab, setActiveTab] = useState<"calculator" | "quiz" | "comparison">("calculator");

  // Calculator logic
  const calculateBafogRisk = () => {
    const excess = Math.max(0, calculator.annualIncome - BAFOEG_LIMIT);
    const repayment = excess * 0.75;
    return { excess, repayment, isAtRisk: excess > 0 };
  };

  const calculateInsuranceRisk = () => {
    if (calculator.insuranceStatus === "family") {
      const monthlyIncome = calculator.annualIncome / 12;
      const isAtRisk = monthlyIncome > FAMILY_INSURANCE_MONTHLY_LIMIT;
      return { isAtRisk, detail: `Monthly income: €${monthlyIncome.toFixed(2)}` };
    } else if (calculator.insuranceStatus === "kvds") {
      const isAtRisk = calculator.weeklyHours > INSURANCE_HOURS_LIMIT;
      return { isAtRisk, detail: `Weekly hours: ${calculator.weeklyHours}h` };
    }
    return { isAtRisk: false, detail: "Other insurance" };
  };

  const calculateTaxRisk = () => {
    const remaining = TAX_FREE_ALLOWANCE - calculator.annualIncome;
    const isAtRisk = calculator.annualIncome > TAX_FREE_ALLOWANCE;
    return { remaining, isAtRisk };
  };

  const bafogRisk = calculateBafogRisk();
  const insuranceRisk = calculateInsuranceRisk();
  const taxRisk = calculateTaxRisk();

  // Quiz logic
  const handleQuizAnswer = (answer: boolean) => {
    if (quiz.currentQuestion === 0) {
      if (answer) {
        setQuiz({ currentQuestion: 1, result: null });
      } else {
        setQuiz({ currentQuestion: 1, result: null });
      }
    } else if (quiz.currentQuestion === 1) {
      if (answer) {
        setQuiz({ currentQuestion: 0, result: "Freiberufler (Freelancer)" });
      } else {
        setQuiz({ currentQuestion: 0, result: "Gewerbetreibender (Trader)" });
      }
    }
  };

  const resetQuiz = () => {
    setQuiz({ currentQuestion: 0, result: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
              <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
            </div>
            <p className="text-sm text-slate-600">Your Side Hustle, De-Risked</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Golden Rules Hero Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">The Three Golden Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200 bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <AlertTriangle className="text-blue-600 w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">BAföG Limit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 mb-2">€{BAFOEG_LIMIT.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Annual income threshold</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-200 bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <AlertTriangle className="text-teal-600 w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">Insurance Limit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-teal-600 mb-2">{INSURANCE_HOURS_LIMIT}h</p>
                <p className="text-sm text-slate-600">Weekly hours per semester</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-200 bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <AlertTriangle className="text-emerald-600 w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">Tax Limit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-emerald-600 mb-2">€{TAX_FREE_ALLOWANCE.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Tax-free allowance (Grundfreibetrag)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "calculator"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Compliance Calculator
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "quiz"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Classification Quiz
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "comparison"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Side Hustle Comparison
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === "calculator" && (
          <section className="mb-16">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Student Compliance Calculator</CardTitle>
                <CardDescription>Adjust your situation to see real-time compliance risks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Input Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* BAföG Status */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900">BAföG Status</label>
                    <Select
                      value={calculator.bafogStatus}
                      onValueChange={(value: any) =>
                        setCalculator({ ...calculator, bafogStatus: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receiving">Receiving BAföG</SelectItem>
                        <SelectItem value="not-receiving">Not Receiving BAföG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Insurance Status */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900">Insurance Status</label>
                    <Select
                      value={calculator.insuranceStatus}
                      onValueChange={(value: any) =>
                        setCalculator({ ...calculator, insuranceStatus: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Family Insurance</SelectItem>
                        <SelectItem value="kvds">KVdS (Student Insurance)</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Annual Income Slider */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900">
                      Annual Gross Income: €{calculator.annualIncome.toLocaleString()}
                    </label>
                    <Slider
                      value={[calculator.annualIncome]}
                      onValueChange={(value) =>
                        setCalculator({ ...calculator, annualIncome: value[0] })
                      }
                      min={0}
                      max={30000}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500">0 - 30,000 €</p>
                  </div>

                  {/* Weekly Hours Slider */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-900">
                      Average Weekly Hours: {calculator.weeklyHours}h
                    </label>
                    <Slider
                      value={[calculator.weeklyHours]}
                      onValueChange={(value) =>
                        setCalculator({ ...calculator, weeklyHours: value[0] })
                      }
                      min={0}
                      max={40}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500">0 - 40 hours</p>
                  </div>

                  {/* BAföG Entitlement */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Expected BAföG Entitlement (€/month)
                    </label>
                    <Input
                      type="number"
                      value={calculator.bafogEntitlement}
                      onChange={(e) =>
                        setCalculator({ ...calculator, bafogEntitlement: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="border-t pt-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Your Compliance Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* BAföG Risk */}
                    <Card className={bafogRisk.isAtRisk ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {bafogRisk.isAtRisk ? (
                            <AlertCircle className="text-red-600 w-5 h-5" />
                          ) : (
                            <CheckCircle className="text-green-600 w-5 h-5" />
                          )}
                          <CardTitle className="text-sm">BAföG Risk</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-slate-600">Excess Income:</p>
                        <p className="text-2xl font-bold text-slate-900">€{bafogRisk.excess.toFixed(2)}</p>
                        {bafogRisk.isAtRisk && (
                          <>
                            <p className="text-xs text-slate-600">Est. Repayment (75%):</p>
                            <p className="text-lg font-semibold text-red-600">€{bafogRisk.repayment.toFixed(2)}</p>
                          </>
                        )}
                        {!bafogRisk.isAtRisk && (
                          <p className="text-sm text-green-700 font-semibold">✓ Within limit</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Insurance Risk */}
                    <Card className={insuranceRisk.isAtRisk ? "border-orange-300 bg-orange-50" : "border-green-300 bg-green-50"}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {insuranceRisk.isAtRisk ? (
                            <AlertCircle className="text-orange-600 w-5 h-5" />
                          ) : (
                            <CheckCircle className="text-green-600 w-5 h-5" />
                          )}
                          <CardTitle className="text-sm">Insurance Risk</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-slate-600">{insuranceRisk.detail}</p>
                        {insuranceRisk.isAtRisk && (
                          <p className="text-sm text-orange-700 font-semibold">⚠ May lose coverage</p>
                        )}
                        {!insuranceRisk.isAtRisk && (
                          <p className="text-sm text-green-700 font-semibold">✓ Covered</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Tax Risk */}
                    <Card className={taxRisk.isAtRisk ? "border-purple-300 bg-purple-50" : "border-green-300 bg-green-50"}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {taxRisk.isAtRisk ? (
                            <AlertCircle className="text-purple-600 w-5 h-5" />
                          ) : (
                            <CheckCircle className="text-green-600 w-5 h-5" />
                          )}
                          <CardTitle className="text-sm">Tax Risk</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-slate-600">Remaining Allowance:</p>
                        <p className="text-2xl font-bold text-slate-900">€{Math.max(0, taxRisk.remaining).toFixed(2)}</p>
                        {taxRisk.isAtRisk && (
                          <p className="text-sm text-purple-700 font-semibold">⚠ File tax return</p>
                        )}
                        {!taxRisk.isAtRisk && (
                          <p className="text-sm text-green-700 font-semibold">✓ Tax-free</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quiz Tab */}
        {activeTab === "quiz" && (
          <section className="mb-16">
            <Card className="bg-white shadow-lg max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Classification Flowchart Quiz</CardTitle>
                <CardDescription>Determine your legal business status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quiz.result === null ? (
                  <>
                    {quiz.currentQuestion === 0 && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                          <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Does your activity involve buying and reselling products, manufacturing goods, or pure advertising revenue?
                          </h3>
                          <p className="text-sm text-slate-600 mb-4">
                            Examples: Dropshipping, Amazon FBA, reselling items
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleQuizAnswer(true)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() => handleQuizAnswer(false)}
                            variant="outline"
                            className="flex-1"
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    )}

                    {quiz.currentQuestion === 1 && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                          <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Does your activity rely on specialized creative, educational, or technical knowledge?
                          </h3>
                          <p className="text-sm text-slate-600 mb-4">
                            Examples: Tutoring, custom programming, writing, graphic design
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleQuizAnswer(true)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            Yes
                          </Button>
                          <Button
                            onClick={() => handleQuizAnswer(false)}
                            variant="outline"
                            className="flex-1"
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-6 rounded-lg border-2 border-emerald-300">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="text-emerald-600 w-8 h-8" />
                        <h3 className="text-2xl font-bold text-slate-900">Your Status</h3>
                      </div>
                      <p className="text-3xl font-bold text-emerald-600 mb-4">{quiz.result}</p>
                      <div className="bg-white p-4 rounded border border-emerald-200 space-y-3">
                        {quiz.result === "Gewerbetreibender (Trader)" && (
                          <>
                            <p className="font-semibold text-slate-900">Next Steps:</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                              <li>Register with Gewerbeamt (Trade Office)</li>
                              <li>Register with Finanzamt (Tax Office)</li>
                              <li>Obtain Steuernummer (Tax Number)</li>
                              <li>Consider business liability insurance</li>
                            </ul>
                          </>
                        )}
                        {quiz.result === "Freiberufler (Freelancer)" && (
                          <>
                            <p className="font-semibold text-slate-900">Next Steps:</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                              <li>Register with Finanzamt (Tax Office) only</li>
                              <li>Obtain Steuernummer (Tax Number)</li>
                              <li>No Gewerbeamt registration needed</li>
                              <li>Keep detailed records of income/expenses</li>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={resetQuiz}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Start Over
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Comparison Tab */}
        {activeTab === "comparison" && (
          <section className="mb-16">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Side Hustle Comparison</CardTitle>
                <CardDescription>Compare different employment models for students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mini-Job */}
                  <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Mini-Job (€520/month)</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-green-600 mb-2">✓ Advantages</p>
                        <ul className="space-y-1 text-slate-700">
                          <li>• Flat-rate social security (3.6%)</li>
                          <li>• Simple tax handling</li>
                          <li>• No registration required</li>
                          <li>• Flexible hours</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-red-600 mb-2">⚠ Risks</p>
                        <ul className="space-y-1 text-slate-700">
                          <li>• Limited income potential</li>
                          <li>• No unemployment insurance</li>
                          <li>• May affect BAföG</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Werkstudent */}
                  <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Werkstudent (Student Worker)</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-green-600 mb-2">✓ Advantages</p>
                        <ul className="space-y-1 text-slate-700">
                          <li>• Full social security coverage</li>
                          <li>• Unemployment insurance included</li>
                          <li>• No hour limits for BAföG</li>
                          <li>• Higher earning potential</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-red-600 mb-2">⚠ Risks</p>
                        <ul className="space-y-1 text-slate-700">
                          <li>• Must stay ≤20h/week during semester</li>
                          <li>• Higher employer contributions</li>
                          <li>• Limited to registered companies</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Self-Employed */}
                  <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Self-Employed (Freelancer/Trader)</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-green-600 mb-2">✓ Advantages</p>
                        <ul className="space-y-1 text-slate-700">
                          <li>• Unlimited earning potential</li>
                          <li>• Complete independence</li>
                          <li>• Tax deductions available</li>
                          <li>• Flexible schedule</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-red-600 mb-2">⚠ Risks</p>
                        <ul className="space-y-1 text-slate-700">
                          <li>• No social security coverage</li>
                          <li>• Must pay own insurance</li>
                          <li>• Complex tax requirements</li>
                          <li>• May lose BAföG eligibility</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          <p>German Student Side Hustle Compliance Portal</p>
          <p className="mt-2">Based on "Your Side Hustle, De-Risked" - A comprehensive guide for German students</p>
        </div>
      </footer>
    </div>
  );
}
