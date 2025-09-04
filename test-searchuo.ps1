# Test SearchUO Integration
Write-Host "Testing SearchUO Price API..." -ForegroundColor Green

# Test data
$testProducts = @(
    "Armor of Fortune",
    "Blade of the Righteous", 
    "Legacy of the Dread Lord",
    "Spirit of the Totem"
)

# API endpoint
$apiUrl = "http://localhost:3000/api/searchuo/price"

Write-Host "`nTesting API endpoint: $apiUrl" -ForegroundColor Yellow

foreach ($product in $testProducts) {
    Write-Host "`n--- Testing: $product ---" -ForegroundColor Cyan
    
    try {
        # Create JSON body
        $body = @{
            productName = $product
        } | ConvertTo-Json
        
        # Make API request
        $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Body $body -ContentType "application/json"
        
        if ($response.success) {
            if ($response.found) {
                Write-Host "✅ Found on SearchUO!" -ForegroundColor Green
                Write-Host "   Price: `$$($response.price)" -ForegroundColor Green
                Write-Host "   Item: $($response.itemName)" -ForegroundColor White
                if ($response.itemDetails) {
                    Write-Host "   Details: $($response.itemDetails.Substring(0, [Math]::Min(50, $response.itemDetails.Length)))..." -ForegroundColor Gray
                }
            } else {
                Write-Host "❌ Not found on SearchUO" -ForegroundColor Red
                Write-Host "   Message: $($response.message)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "❌ API Error: $($response.error)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Request failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Make sure your Next.js server is running on localhost:3000" -ForegroundColor Yellow
    }
}

Write-Host "`n--- Test Complete ---" -ForegroundColor Green
Write-Host "If you see connection errors, make sure to:" -ForegroundColor Yellow
Write-Host "1. Start your Next.js server: npm run dev" -ForegroundColor White
Write-Host "2. Wait for it to fully load" -ForegroundColor White
Write-Host "3. Run this test again" -ForegroundColor White
