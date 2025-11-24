#!/bin/bash

echo "🧪 Running 5 Test Generations to Validate Consistency"
echo "========================================================"
echo ""

# Array of supplements to test
supplements=(
  "Ashwagandha"
  "Magnesium Glycinate"
  "Lions Mane Mushroom"
  "Omega-3 Fish Oil"
  "Vitamin D3 + K2"
)

results_file="test-results-$(date +%Y%m%d-%H%M%S).json"
echo "[" > $results_file

for i in "${!supplements[@]}"; do
  supplement="${supplements[$i]}"
  test_num=$((i + 1))

  echo "Test $test_num/5: $supplement"
  echo "-----------------------------------"

  # Run generation
  result=$(curl -s -X POST http://localhost:3000/generate/"$supplement" \
    -H "Content-Type: application/json" \
    -d '{"dryRun": true}' \
    --max-time 300)

  # Save result
  echo "$result" >> $results_file
  if [ $i -lt 4 ]; then
    echo "," >> $results_file
  fi

  # Extract key metrics
  human_score=$(echo "$result" | grep -o '"humanScore":[0-9]*' | grep -o '[0-9]*')
  ai_score=$(echo "$result" | grep -o '"aiScore":[0-9.]*' | grep -o '[0-9.]*')
  word_count=$(echo "$result" | grep -o '"wordCount":[0-9]*' | grep -o '[0-9]*')
  attempts=$(echo "$result" | grep -o '"attempts":[0-9]*' | grep -o '[0-9]*')

  if [ ! -z "$human_score" ]; then
    echo "✅ Human Score: ${human_score}%"
    echo "   AI Score: ${ai_score}%"
    echo "   Word Count: $word_count"
    echo "   Attempts: $attempts"

    if [ "$human_score" -ge 75 ]; then
      echo "   Status: ✅ PASSED (≥75%)"
    else
      echo "   Status: ⚠️  BELOW TARGET"
    fi
  else
    echo "❌ Generation failed or timed out"
  fi

  echo ""

  # Small delay between tests
  if [ $i -lt 4 ]; then
    sleep 2
  fi
done

echo "]" >> $results_file

echo "========================================================"
echo "✅ All tests complete! Results saved to: $results_file"
echo ""

# Summary analysis
echo "📊 SUMMARY ANALYSIS"
echo "-------------------"

# Count passes
passes=$(grep -o '"humanScore":[0-9]*' $results_file | grep -o '[0-9]*' | awk '$1 >= 75 {count++} END {print count}')
total=5

echo "Tests Passed: $passes/$total"
echo "Success Rate: $(( passes * 100 / total ))%"
echo ""

if [ "$passes" -eq 5 ]; then
  echo "🎉 PERFECT! All tests passed - Ready for deployment!"
elif [ "$passes" -ge 4 ]; then
  echo "✅ GOOD! 80%+ success rate - System is production ready"
else
  echo "⚠️  WARNING: Less than 80% success rate - Review failed tests"
fi
