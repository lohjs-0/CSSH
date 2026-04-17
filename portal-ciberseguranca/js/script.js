document.addEventListener('DOMContentLoaded', () => {
    // Rolagem suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, 
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação de entrada dos cards
    const cards = document.querySelectorAll('.feature-card, .module-learning-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // --- Lógica do Modal de Conteúdo ---

    // Dados das Funcionalidades (Features)
    const featuresData = {
        'teoria': {
            title: "Teoria Completa",
            description: "Aprofunde-se nos conceitos fundamentais com nosso material teórico detalhado.",
            chapters: [
                {
                    title: "Fundamentos de Redes",
                    topics: ["Modelo OSI e TCP/IP", "Protocolos Comuns", "Endereçamento IP"]
                },
                {
                    title: "Sistemas Operacionais",
                    topics: ["Segurança em Linux", "Hardening de Windows", "Permissões de Arquivos"]
                },
                {
                    title: "Segurança de Aplicações",
                    topics: ["OWASP Top 10", "Injeção de SQL", "Cross-Site Scripting (XSS)"]
                }
            ]
        },
        'labs': {
            title: "Labs Práticos",
            description: "Ambientes controlados para você colocar a mão na massa e praticar ataques e defesas.",
            chapters: [
                {
                    title: "Laboratórios de Invasão",
                    topics: ["Exploração de Vulnerabilidades", "Escalação de Privilégios", "Pivoting"]
                },
                {
                    title: "Laboratórios de Defesa",
                    topics: ["Configuração de Firewall", "Análise de Tráfego (Wireshark)", "Configuração de IDS"]
                }
            ]
        },
        'flashcards': {
            title: "Flashcards",
            description: "Sistema de repetição espaçada para memorizar termos técnicos e conceitos-chave.",
            chapters: [
                {
                    title: "Terminologia de Segurança",
                    topics: ["Ameaça vs Vulnerabilidade vs Risco", "Tipos de Malware", "Siglas Essenciais"]
                },
                {
                    title: "Portas e Protocolos",
                    topics: ["Portas Comuns (22, 80, 443, etc.)", "Protocolos de Camada de Aplicação"]
                }
            ]
        },
        'cheatsheets': {
            title: "Cheatsheets",
            description: "Guias rápidos de referência para comandos e ferramentas essenciais.",
            chapters: [
                {
                    title: "Ferramentas de Linha de Comando",
                    topics: ["Nmap Cheat Sheet", "Metasploit Commands", "Linux Terminal Basics"]
                },
                {
                    title: "Análise de Dados",
                    topics: ["Regex para Segurança", "Comandos de Log Analysis"]
                }
            ]
        },
        'simulados': {
            title: "Simulados",
            description: "Prepare-se para certificações reais com questões atualizadas e comentadas.",
            chapters: [
                {
                    title: "CompTIA Security+",
                    topics: ["Simulado Completo SY0-701", "Questões por Domínio", "Explicações Detalhadas"]
                },
                {
                    title: "Certificações de Entrada",
                    topics: ["Google Cybersecurity Professional", "ISC2 CC"]
                }
            ]
        },
        'gratuito': {
            title: "Acesso Gratuito",
            description: "Nossa missão é democratizar o ensino de cibersegurança no Brasil.",
            chapters: [
                {
                    title: "Por que Gratuito?",
                    topics: ["Projeto Open Source", "Comunidade Colaborativa", "Sem Assinaturas Ocultas"]
                },
                {
                    title: "Como Contribuir",
                    topics: ["Reportar Erros no GitHub", "Sugerir Novos Temas", "Compartilhar com Amigos"]
                }
            ]
        }
    };

    // Dados dos Módulos (Cursos)
    const modulesData = {
        1: {
            title: "Conceitos Fundamentais",
            description: "A base de tudo em cibersegurança. Entenda os princípios que regem a proteção de dados.",
            chapters: [
                {
                    title: "Tríade CIA",
                    topics: ["Confidencialidade", "Integridade", "Disponibilidade", "Não-repúdio"]
                },
                {
                    title: "Frameworks de Segurança",
                    topics: ["NIST CSF", "ISO 27001", "CIS Controls"]
                },
                {
                    title: "Tipos de Controles",
                    topics: ["Controles Físicos", "Controles Técnicos", "Controles Administrativos"]
                }
            ]
        },
        2: {
            title: "Tipos de Ameaças",
            description: "Conheça o inimigo. Identifique os diferentes tipos de ataques e quem os executa.",
            chapters: [
                {
                    title: "Atores de Ameaças",
                    topics: ["Script Kiddies", "Hacktivistas", "State-sponsored", "Insider Threats"]
                },
                {
                    title: "Engenharia Social",
                    topics: ["Phishing", "Vishing", "Smishing", "Tailgating"]
                }
            ]
        },
        3: {
            title: "Criptografia",
            description: "A arte de esconder informações. Domine as técnicas de cifragem modernas.",
            chapters: [
                {
                    title: "Algoritmos Simétricos",
                    topics: ["AES", "DES/3DES", "Blowfish"]
                },
                {
                    title: "Algoritmos Assimétricos",
                    topics: ["RSA", "Diffie-Hellman", "Curva Elíptica (ECC)"]
                }
            ]
        },
        4: {
            title: "Gestão de Identidade",
            description: "Quem é você? Controle quem acessa o quê dentro da rede.",
            chapters: [
                {
                    title: "Autenticação",
                    topics: ["Multi-fator (MFA)", "Biometria", "Tokens", "SSO"]
                },
                {
                    title: "Modelos de Controle",
                    topics: ["RBAC", "ABAC", "MAC", "DAC"]
                }
            ]
        },
        5: {
            title: "Segurança de Rede",
            description: "Proteja o perímetro e o tráfego de dados entre dispositivos.",
            chapters: [
                {
                    title: "Protocolos Seguros",
                    topics: ["HTTPS", "SSH", "SFTP", "IPsec"]
                },
                {
                    title: "Dispositivos",
                    topics: ["Firewalls (NGFW)", "IDS/IPS", "Proxies"]
                }
            ]
        },
        6: {
            title: "Operações e Resposta",
            description: "Mantenha a guarda alta e saiba como reagir quando algo der errado.",
            chapters: [
                {
                    title: "Monitoramento",
                    topics: ["SIEM", "SOAR", "Análise de Logs"]
                },
                {
                    title: "Resposta a Incidentes",
                    topics: ["Preparação", "Identificação", "Contenção", "Recuperação"]
                }
            ]
        }
    };

    const modal = document.getElementById('moduleModal');
    const closeBtn = document.querySelector('.close-modal');
    const modalBody = document.getElementById('modalBody');

    // Função para abrir o modal
    function openModal(data) {
        if (!data) return;

        // Construir o conteúdo do modal
        let html = `
            <div class="modal-header-content">
                <h2>${data.title}</h2>
                <p>${data.description}</p>
            </div>
            <div class="chapters-container">
        `;

        data.chapters.forEach((chapter, index) => {
            html += `
                <div class="chapter-item">
                    <div class="chapter-title">
                        <span class="chapter-number">${index + 1}</span>
                        <h4>${chapter.title}</h4>
                    </div>
                    <ul class="topic-list">
                        ${chapter.topics.map(topic => `<li><i class="fas fa-check-circle"></i> ${topic}</li>`).join('')}
                    </ul>
                </div>
            `;
        });

        html += `</div>
            <div class="modal-footer">
                <button class="btn btn-primary">Acessar Conteúdo</button>
            </div>
        `;

        modalBody.innerHTML = html;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Travar scroll do fundo
    }

    // Evento para cards de Funcionalidades (Features)
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const featureId = card.getAttribute('data-feature');
            openModal(featuresData[featureId]);
        });
    });

    // Evento para cards de Módulos
    const moduleCards = document.querySelectorAll('.module-learning-card');
    moduleCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const moduleId = card.getAttribute('data-module');
            openModal(modulesData[moduleId]);
        });
    });

    // Fechar modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
