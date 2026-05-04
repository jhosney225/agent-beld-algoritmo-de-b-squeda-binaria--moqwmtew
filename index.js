
```javascript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();

// Binary search implementation with visualization
class BinarySearchVisualizer {
  constructor() {
    this.array = [];
    this.steps = [];
  }

  // Generate a sorted array
  generateArray(size = 10) {
    this.array = Array.from(
      { length: size },
      (_, i) => (i + 1) * 10
    );
    this.steps = [];
    return this.array;
  }

  // Perform binary search with step tracking
  search(target) {
    this.steps = [];
    let left = 0;
    let right = this.array.length - 1;
    let step = 0;

    while (left <= right) {
      step++;
      const mid = Math.floor((left + right) / 2);
      const midValue = this.array[mid];

      this.steps.push({
        step,
        left,
        right,
        mid,
        midValue,
        array: [...this.array],
        status:
          midValue === target
            ? "found"
            : midValue < target
              ? "search_right"
              : "search_left",
      });

      if (midValue === target) {
        return { found: true, index: mid, steps: this.steps };
      } else if (midValue < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return { found: false, index: -1, steps: this.steps };
  }

  // Visualize array with highlights
  visualizeStep(step) {
    const stepData = this.steps[step];
    if (!stepData) return "";

    let visualization = "\n Array: [";
    for (let i = 0; i < stepData.array.length; i++) {
      if (i === stepData.mid) {
        visualization += `\x1b[1;33m${stepData.array[i]}\x1b[0m`;
      } else if (i >= stepData.left && i <= stepData.right) {
        visualization += `\x1b[1;36m${stepData.array[i]}\x1b[0m`;
      } else {
        visualization += `${stepData.array[i]}`;
      }

      if (i < stepData.array.length - 1) visualization += ", ";
    }
    visualization += "]\n";

    visualization += `Step ${stepData.step}: Checking middle element at index ${stepData.mid} (value: ${stepData.midValue})\n`;
    visualization += `Search range: [${stepData.left}...${stepData.right}]\n`;
    visualization += `Status: ${stepData.status}\n`;

    return visualization;
  }

  // Display all steps
  displayAllSteps() {
    let result = "\n=== Binary Search Visualization ===\n";
    result += `Array: [${this.array.join(", ")}]\n`;

    for (let i = 0; i < this.steps.length; i++) {
      result += this.visualizeStep(i);
      result += "---\n";
    }

    return result;
  }

  // Get statistics
  getStatistics() {
    return {
      arraySize: this.array.length,
      totalSteps: this.steps.length,
      maxPossibleSteps: Math.ceil(Math.log2(this.array.length)),
      efficiency: (
        (this.steps.length /
          Math.ceil(Math.log2(this.array.length))) *
        100
      ).toFixed(2),
    };
  }
}

// Main interactive session with Claude
async function runInteractiveSession() {
  const visualizer = new BinarySearchVisualizer();
  const conversationHistory = [];
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) =>
    new Promise((resolve) => {
      rl.question(prompt, resolve);
    });

  console.log("=== Binary Search Visualization with Claude ===");
  console.log(
    "This tool demonstrates binary search with Claude's assistance."
  );
  console.log("Commands:");
  console.log("  'generate' - Generate a new sorted array");
  console.log("  'search <number>' - Search for a number");
  console.log("  'visualize' - Show all search steps");
  console.log("  'stats' - Show algorithm statistics");
  console.log("  'help' - Get AI assistance");
  console.log("  'exit' - Quit the program\n");

  // Initial setup
  visualizer.generateArray(10);
  console.log(`Generated array: [${visualizer.array.join(", ")}]\n`);

  while (true) {
    const userInput = await question("You: ");

    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      break;
    }

    // Process user command
    let commandOutput = "";

    if (userInput.toLowerCase() === "generate") {
      visualizer.generateArray(10);
      commandOutput = `Generated new array: [${visualizer.array.join(", ")}]`;
    } else if (userInput.toLowerCase().startsWith("search")) {
      const target = parseInt(userInput.split(" ")[1]);
      if (!isNaN(target)) {
        const result = visualizer.search(target);
        if (result.found) {
          commandOutput = `Found ${target} at index ${result.index}!\n`;
        } else {
          commandOutput = `${target} not found in the array.\n`;
        }
        commandOutput += visualizer.displayAllSteps();
      } else {
        commandOutput = "Please provide a valid number to search.";
      }
    } else if (userInput.toLowerCase() === "visual