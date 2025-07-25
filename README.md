Laboratório Missionário
Laboratório Missionário é uma ferramenta web de apoio à triagem clínica e análise de exames laboratoriais em campo, com foco em contextos missionários e áreas remotas. O sistema permite organizar perfis de pacientes, inserir dados laboratoriais, gerar relatórios explicativos via Inteligência Artificial (Google Gemini), exportar em PDF e compartilhar rapidamente via WhatsApp. Tudo isso com interface amigável, responsiva e leve!

Recursos Principais
Cadastro de Perfis de Paciente: Salve e gerencie múltiplos perfis, incluindo pacientes pediátricos e adultos.

Formulário de Dados Clínicos: Insira resultados de exames de sangue, bioquímica, gasometria, eletrólitos e doenças regionais (Chagas, Dengue, etc).

Análise por IA (Gemini): Gere relatórios detalhados e explicativos, com recomendações, sinais de alerta e orientações práticas, adaptadas ao perfil do paciente.

Histórico de Atendimentos: Consulte relatórios anteriores, visualizando e reaproveitando informações.

Exportação em PDF: Gere facilmente um PDF do relatório para salvar, imprimir ou compartilhar.

Envio por WhatsApp: Compartilhe o relatório com um clique diretamente no WhatsApp.

Suporte offline e instalação como PWA: O app pode ser instalado em dispositivos móveis para uso offline.

Interface Moderna: Visual leve e adaptado ao uso em campo, feito com TailwindCSS e fontes Google.

Como Usar
Abra o arquivo HTML em seu navegador (pode ser hospedado em qualquer servidor estático ou aberto diretamente).

Cadastre um perfil de paciente (nome, idade, sexo e se é pediátrico).

Preencha os campos do formulário com os dados do exame e sintomas.

Clique em “Analisar com IA (Gemini)” para gerar o relatório automático.

Visualize, gere PDF ou compartilhe por WhatsApp usando os botões exibidos no relatório.

Acesse o histórico de atendimentos para visualizar relatórios antigos ou revisar casos.

Tecnologias Utilizadas
HTML5, CSS3, JavaScript (ES6+)

TailwindCSS

Google Fonts (Inter)

Google Gemini API para geração de relatório por IA

jsPDF e html2canvas para exportação em PDF

localStorage para histórico e perfis

Instalável como PWA (Progressive Web App)

Segurança e Observações
Atenção: O uso de chaves de API do Google Gemini diretamente no frontend não é seguro para produção. Recomenda-se a criação de um backend para proteger sua chave.

Aviso legal: Esta ferramenta não substitui avaliação médica presencial ou decisões clínicas por profissionais de saúde qualificados.

Os dados ficam salvos apenas no dispositivo do usuário (localStorage). Não há envio para servidores externos (exceto para a API do Gemini ao gerar relatório).

Instalação/Execução Local
Faça o download/clonagem do projeto.

Dê um duplo clique no arquivo index.html ou abra com um servidor local.

Pronto! Use normalmente em seu navegador moderno favorito.

Personalização
Modifique os campos do formulário conforme a realidade da sua missão.

Altere o prompt de IA no script para ajustar o comportamento do Gemini para casos específicos (ex: doenças locais).

Adapte o layout e branding para sua organização.

Licença
Projeto de código aberto, de uso livre para fins missionários e educacionais.
Consulte o código fonte para detalhes e cite quando for utilizar publicamente.

Suporte/Contato
Dúvidas, sugestões ou colaboração?
Entre em contato com o desenvolvedor do projeto, ou contribua via GitHub.

Laboratório Missionário – IA e cuidado onde mais importa!
