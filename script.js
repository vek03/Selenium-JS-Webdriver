const assert = require('assert');
const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
  // Configurar o navegador Chrome
  const options = new chrome.Options();
  options.addArguments('start-maximized'); // Maximizar a janela do navegador

  // Criar o WebDriver
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // Inicializar um objeto para armazenar os resultados do teste
  const testResults = {
    assertions: [],
    success: true,
  };

  try {
    // Navegar até o site desejado
    await driver.get('https://www.google.com');

    // Encontrar o campo de pesquisa e digitar algo
    await driver.findElement(By.name('q')).sendKeys('Selenium-JS-Webdriver', Key.RETURN);

    // Aguardar até que a página de resultados seja carregada
    await driver.wait(until.titleIs('Selenium - Pesquisa Google'), 15000);

    // Exibir o título da página no console
    const pageTitle = await driver.getTitle();
    console.log('Título da Página:', pageTitle);

    // Assertion 1: Verificar se o título da página contém a palavra 'Selenium'
    assert.ok(pageTitle.includes('Selenium'), 'O título da página não contém a palavra "Selenium".');
    testResults.assertions.push('Assertion 1: O título da página contém a palavra "Selenium".');

    // Assertion 2: Verificar se o primeiro resultado da pesquisa contém a palavra 'Selenium'
    const firstResult = await driver.findElement(By.css('h3'));
    const firstResultText = await firstResult.getText();
    assert.ok(firstResultText.includes('Selenium'), 'O primeiro resultado não contém a palavra "Selenium".');
    testResults.assertions.push('Assertion 2: O primeiro resultado contém a palavra "Selenium".');

  } catch (error) {
    console.error('Erro:', error.message);
    testResults.success = false;
    testResults.error = error.message;
  } finally {
    // Fechar o navegador ao finalizar o teste
    await driver.quit();

    // Gravar os resultados em um arquivo de log
    fs.writeFileSync('test-log.txt', JSON.stringify(testResults, null, 2));
  }
}

// Chamar a função para executar o teste
runTest();