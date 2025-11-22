import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Linking
} from "react-native";

type Operator = "+" | "-" | "×" | "÷";

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  // Calculator state
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [isNewEntry, setIsNewEntry] = useState<boolean>(true);

  const maxContentWidth = Math.min(width, 420);

  const handleDigitPress = (digit: string) => {
    setDisplayValue((current) => {
      if (isNewEntry || current === "0") {
        setIsNewEntry(false);
        return digit;
      }
      return current + digit;
    });
  };

  const handleDotPress = () => {
    setDisplayValue((current) => {
      if (isNewEntry) {
        setIsNewEntry(false);
        return "0.";
      }
      if (current.includes(".")) {
        return current;
      }
      return current + ".";
    });
  };

  const performCalculation = (
    op: Operator,
    a: number,
    b: number
  ): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const handleOperatorPress = (nextOperator: Operator) => {
    const current = parseFloat(displayValue);

    if (previousValue !== null && operator && !isNewEntry) {
      const result = performCalculation(operator, previousValue, current);
      setPreviousValue(result);
      setDisplayValue(Number.isNaN(result) ? "Error" : result.toString());
    } else {
      setPreviousValue(current);
    }

    setOperator(nextOperator);
    setIsNewEntry(true);
  };

  const handleEqualsPress = () => {
    if (operator === null || previousValue === null) {
      return;
    }

    const current = parseFloat(displayValue);
    const result = performCalculation(operator, previousValue, current);

    setDisplayValue(Number.isNaN(result) ? "Error" : result.toString());
    setPreviousValue(null);
    setOperator(null);
    setIsNewEntry(true);
  };

  const handleClearPress = () => {
    setDisplayValue("0");
    setPreviousValue(null);
    setOperator(null);
    setIsNewEntry(true);
  };

  const handleToggleSignPress = () => {
    setDisplayValue((current) => {
      if (current === "0" || current === "Error") {
        return current;
      }
      if (current.startsWith("-")) {
        return current.slice(1);
      }
      return "-" + current;
    });
  };

  const handlePercentPress = () => {
    setDisplayValue((current) => {
      const value = parseFloat(current);
      if (Number.isNaN(value)) return current;
      const result = value / 100;
      return result.toString();
    });
  };

  const handleButtonPress = (label: string) => {
    if (/^[0-9]$/.test(label)) {
      handleDigitPress(label);
      return;
    }

    switch (label) {
      case ".":
        handleDotPress();
        break;
      case "AC":
        handleClearPress();
        break;
      case "+/-":
        handleToggleSignPress();
        break;
      case "%":
        handlePercentPress();
        break;
      case "+":
      case "-":
      case "×":
      case "÷":
        handleOperatorPress(label);
        break;
      case "=":
        handleEqualsPress();
        break;
      default:
        break;
    }
  };

  const buttonRows: string[][] = [
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const isOperator = (label: string): boolean =>
    label === "+" || label === "-" || label === "×" || label === "÷";

  const getButtonStyle = (label: string) => {
    if (isOperator(label) || label === "=") {
      return [styles.button, styles.buttonOperator];
    }
    if (label === "AC" || label === "+/-" || label === "%") {
      return [styles.button, styles.buttonUtility];
    }
    if (label === "0") {
      return [styles.button, styles.buttonDigit, styles.buttonWide];
    }
    return [styles.button, styles.buttonDigit];
  };

  const REPO_URL = "https://github.com/europanite/calculator";

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => Linking.openURL(REPO_URL)}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: "800",
            marginBottom: 12,
            color: "#c5c5c5ff",
            textDecorationLine: "underline",
          }}
        >
          Calculator
        </Text>
      </TouchableOpacity>
      <View style={[styles.contentContainer, { maxWidth: maxContentWidth }]}>
        <View style={styles.displayContainer}>
          <Text
            style={styles.displayText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayValue}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          {buttonRows.map((row, rowIndex) => (
            <View style={styles.row} key={`row-${rowIndex}`}>
              {row.map((label) => (
                <Pressable
                  key={label}
                  style={({ pressed }) => [
                    ...getButtonStyle(label),
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => handleButtonPress(label)}
                >
                  <Text style={styles.buttonText}>{label}</Text>
                </Pressable>
              ))}

              {/* For the last row (0 . =) we want exactly 3 columns:
                  0 (wide) + . + =, so no extra placeholder is needed */}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  contentContainer: {
    width: "100%",
  },
  displayContainer: {
    minHeight: 80,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  displayText: {
    color: "#ffffff",
    fontSize: 56,
    fontWeight: "300",
  },
  buttonsContainer: {
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonWide: {
    flex: 2,
  },
  buttonDigit: {
    backgroundColor: "#333333",
  },
  buttonUtility: {
    backgroundColor: "#a5a5a5",
  },
  buttonOperator: {
    backgroundColor: "#ff9f0a",
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "500",
  },
});
