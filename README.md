SDR Agent – Backend

Este repositório contém o backend do projeto SDR Agent, um assistente automatizado capaz de conversar com leads, identificar interesse em um produto ou serviço e, quando apropriado, agendar uma reunião automaticamente.

O backend orquestra a integração entre:

OpenAI API (para conduzir a conversa e interpretar intenções);

Pipefy (para registrar e atualizar leads no funil de pré-vendas);

Calendly/Cal.com/Google Calendar (para agendamento automático de reuniões).

Este serviço expõe endpoints e WebSocket para comunicação com o webchat do frontend, garantindo persistência de dados e fluxo natural de interação.
Mais detalhes de configuração e execução serão adicionados nas próximas versões.