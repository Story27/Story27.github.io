"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/pages/navbar/navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { runCode } from "@/actions/run";
import Editor from "@monaco-editor/react";
import { updateAcceptances } from "@/actions/acceptance";

interface TestCase {
  id: string;
  input: string;
  output: string;
  isSampleTestCase: boolean;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topics: string;
  testCases: TestCase[];
}

const ProblemPage: React.FC<{ problemId: string }> = ({ problemId }) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [selectedTab, setSelectedTab] = useState("input");
  const [code, setCode] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [verdict, setVerdict] = useState<string>("");
  const [language, setLanguage] = useState<string>("cpp");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onLanguageChange = (value: string) => {
    setLanguage(value);
    console.log("Selected language:", value);
  };

  const handleRun = async () => {
    if (input === "") {
      setOutput("Please enter an input");
      return;
    }
    setOutput("");
    setVerdict("");
    setIsProcessing(true);

    const payload = {
      language:
        language === "cpp" ? "cpp" : language === "java" ? "java" : "python",
      code,
      input,
    };

    try {
      const result = await runCode(
        payload.language,
        payload.code,
        payload.input
      );
      setOutput(result);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("An error occurred while processing your code.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    setOutput("");
    setVerdict("");
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch problem data");
      const data = await response.json();
      const testCases = data.testCases;

      let allTestsPassed = true;
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const payload = {
          language:
            language === "cpp"
              ? "cpp"
              : language === "java"
              ? "java"
              : "python",
          code,
          input: testCase.input,
        };

        try {
          const result = await runCode(
            payload.language,
            payload.code,
            payload.input
          );
          if (result.trim() !== testCase.output.trim()) {
            allTestsPassed = false;
            setVerdict(`Failed on Test Case ${i + 1}`);
            break;
          }
        } catch (error) {
          console.error("Error submitting code:", error);
          setVerdict("An error occurred while processing your code.");
          setIsProcessing(false);
          return;
        }
      }

      if (allTestsPassed) {
        setVerdict("Accepted");
        updateAcceptances(problemId)
          .then(() => {
            console.log("Acceptance updated successfully");
          })
          .catch((error) => {
            console.error("Error updating acceptances:", error);
          });
      }
    } catch (error) {
      console.error("Error fetching problem data:", error);
      setVerdict("Failed to load problem data. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`/api/problems/${problemId}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch problem data");
        const data = await response.json();
        setProblem(data);
      } catch (err) {
        console.error("Error fetching problem data:", err);
        setError("Failed to load problem data. Please try again.");
      }
    };

    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!problem) {
    return (
      <div className="h-screen bg-black text-white py-5">
        <Navbar />
        <div className="p-4">
          <Skeleton className="h-10 w-3/4 mb-4 bg-[#1F1E1F]" />
          <Skeleton className="h-8 w-1/2 mb-4 bg-[#1F1E1F]" />
          <Skeleton className="h-6 w-full mb-2 bg-[#1F1E1F]" />
          <Skeleton className="h-6 w-full mb-2 bg-[#1F1E1F]" />
          <Skeleton className="h-6 w-full mb-2 bg-[#1F1E1F]" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white py-5 overflow-hidden">
      <Navbar />
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} className="p-4 text-white">
          <ScrollArea className="h-full">
            <Card className="w-full max-w-4xl shadow-md h-full overflow-auto scrollbar-hide bg-[#1F1E1F]">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white">
                  {problem.title}
                </h2>
                <Badge
                  variant="outline"
                  className={`mt-2 w-fit text-center text-white ${
                    problem.difficulty === "EASY"
                      ? "bg-green-500"
                      : problem.difficulty === "MEDIUM"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  <span className="inline-block text-white">
                    {problem.difficulty}
                  </span>
                </Badge>
                <p className="text-sm text-gray-500 mt-2">
                  Topic: {problem.topics}
                </p>
              </CardHeader>
              <CardContent className="overflow-y-auto no-scrollbar h-full text-white">
                <div className="p-6">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p>{problem.description}</p>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold">Sample Test Cases</h3>
                  {problem.testCases
                    .filter((tc) => tc.isSampleTestCase)
                    .map((testCase) => (
                      <div key={testCase.id} className="mb-4">
                        <p className="bg-[#383638] border border-gray-700 rounded-md p-2 my-4">
                          <strong>Input:</strong>
                          <br />
                          {testCase.input}
                        </p>
                        <p className="bg-[#383638] border border-gray-700 rounded-md p-2 my-4">
                          <strong>Output:</strong>
                          <br />
                          {testCase.output}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} className="p-4">
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1.5 w-fit">
                <Label htmlFor="language">Language</Label>
                <Select
                  onValueChange={(value) => onLanguageChange(value)}
                  disabled={isProcessing}
                  defaultValue="cpp"
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="C++" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Editor
                height="400px"
                defaultLanguage={language}
                value={
                  code ||
                  (language === "cpp"
                    ? "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}"
                    : language === "python"
                    ? "# Write your python code here\n"
                    : language === "java"
                    ? "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}"
                    : "")
                }
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  readOnly: isProcessing,
                }}
              />
            </div>
            <div className="flex space-x-4 p-4">
              <Button
                className="bg-white text-black hover:bg-black hover:text-white"
                onClick={() => {
                  setSelectedTab("output");
                  handleRun();
                }}
                disabled={isProcessing}
              >
                Run
              </Button>
              <Button
                className="bg-white text-black hover:bg-black hover:text-white"
                onClick={() => {
                  setSelectedTab("verdict");
                  handleSubmit();
                }}
                disabled={isProcessing}
              >
                Submit
              </Button>
            </div>
            <Tabs
              defaultValue="input"
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-[#27262B]">
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
                <TabsTrigger value="verdict">Verdict</TabsTrigger>
              </TabsList>
              <TabsContent value="input">
                <Textarea
                  placeholder="Input"
                  className="h-40 bg-black text-white"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isProcessing}
                />
              </TabsContent>
              <TabsContent value="output">
                <Textarea
                  placeholder="Output"
                  className="h-40 bg-[#1F1E1F] text-white"
                  value={output}
                  readOnly
                />
              </TabsContent>
              <TabsContent value="verdict">
                <Textarea
                  placeholder="Verdict"
                  className="h-40 bg-[#1F1E1F] text-white"
                  disabled
                  value={verdict}
                  readOnly
                />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProblemPage;
